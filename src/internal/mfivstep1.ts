import { chainFrom } from "transducist"
import { insufficientData } from "../error"
import { MfivContext, MfivParams } from "../mfiv"
import { toMapOfOptionPair } from "../models/optionpair"
import { Expiries, MfivOptionSummary, OptionPairMap, OptionSummary, OptionSummaryInput } from "../types"

export interface MfivStepInput {
  context: MfivContext
  params: MfivParams
  expiries?: Expiries<MfivOptionSummary>
}
export class MfivStep1 {
  run(input: MfivStepInput): Expiries<MfivOptionSummary> {
    const { nearDate, nextDate, options, underlyingPrice } = input.params
    const partitions = chainFrom(options)
      .map(ensureDefaults)
      .filter(validOption)
      .filter(isOneOf(nearDate, nextDate))
      .map(chooseMidOrMark)
      .map(convertTo(underlyingPrice))
      .toObjectGroupBy(o => o.expirationDate.toISOString())

    const nearBook = partitions[nearDate]
    const nextBook = partitions[nextDate]
    const nearOptionPairMap = toMapOfOptionPair(nearBook) as OptionPairMap<MfivOptionSummary>
    const nextOptionPairMap = toMapOfOptionPair(nextBook) as OptionPairMap<MfivOptionSummary>

    return {
      nearBook,
      nextBook,
      nearOptionPairMap,
      nextOptionPairMap
    }
  }
}

const ensureDefaults = (o: OptionSummary) => {
  return {
    ...o,
    bestAskPrice: o.bestAskPrice ?? 0,
    bestBidPrice: o.bestBidPrice ?? 0,
    markPrice: o.markPrice ?? 0,
    underlyingPrice: o.underlyingPrice ?? 0
  }
}

const validOption = (o: OptionSummaryInput) => o.bestBidPrice !== 0 && o.bestBidPrice !== undefined

const isOneOf = (...isoDateStrings: string[]) => {
  const epochs = isoDateStrings.map(Date.parse)
  return (o: OptionSummary) => epochs.includes(o.expirationDate.valueOf())
}

const chooseMidOrMark = (o: OptionSummary): Omit<MfivOptionSummary, "optionPrice"> => {
  let midPrice: number | undefined = undefined
  const bestBidPrice = o.bestBidPrice,
    bestAskPrice = o.bestAskPrice,
    markPrice = o.markPrice

  if (bestBidPrice === 0) {
    throw insufficientData("bestBidPrice missing")
  } else if (bestAskPrice === 0) {
    return {
      ...o,
      midPrice: markPrice,
      bestBidPrice,
      bestAskPrice,
      markPrice,
      reason: "bestAskPrice missing",
      source: "mark"
    }
  } else {
    midPrice = (bestAskPrice + bestBidPrice) / 2
    return midPrice >= 1.5 * markPrice
      ? {
          ...o,
          midPrice: markPrice,
          bestBidPrice,
          bestAskPrice,
          markPrice,
          reason: "mid >= 1.5 * mark",
          source: "mark"
        }
      : {
          ...o,
          midPrice: midPrice,
          bestBidPrice,
          bestAskPrice,
          markPrice,
          reason: "mid < 1.5 * mark",
          source: "mid"
        }
  }
}

const convertTo =
  (underlyingPrice: number) =>
  (o: ReturnType<typeof chooseMidOrMark>): MfivOptionSummary => {
    const optionPrice = (o.midPrice as number) * underlyingPrice
    return { ...o, optionPrice }
  }
