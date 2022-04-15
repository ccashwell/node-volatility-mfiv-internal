import { chainFrom } from "transducist"
import { debug } from "../debug"
import { insufficientData } from "../error"
import { MfivContext, MfivParams } from "../mfiv"
import { toMapOfOptionPair } from "../models/optionpair"
import { Expiries, MfivOptionSummary, OptionPairMap, OptionSummary, OptionSummaryInput } from "../types"

export interface MfivStepInput {
  context: MfivContext
  params: MfivParams
  expiries?: Expiries<Required<MfivOptionSummary>>
}
export class MfivStep1 {
  run(input: MfivStepInput): Expiries<Required<MfivOptionSummary>> {
    const { nearDate, nextDate, options, underlyingPrice } = input.params
    debug("Processing %d options", options.length)
    const partitions = chainFrom(options)
      .map(ensureDefaults)
      .filter(validOption)
      .filter(isOneOf(nearDate, nextDate))
      .map(chooseMidOrMark)
      .map(convertTo(underlyingPrice))
      .toObjectGroupBy(o => o.expirationDate.toISOString())

    debug("Options Partitioned")
    debug("Partition keys %o", Object.keys(partitions))
    debug(
      "nearDate: %s : nextDate: %s : partitions.keys: %o : partitions[nearDate].length: %d, partitions[nextDate].length: %d",
      nearDate,
      nextDate,
      Object.keys(partitions),
      partitions[nearDate].length,
      partitions[nextDate].length
    )
    const nearBook = partitions[nearDate]
    const nextBook = partitions[nextDate]
    const nearOptionPairMap = toMapOfOptionPair(nearBook) as OptionPairMap<Required<MfivOptionSummary>>
    const nextOptionPairMap = toMapOfOptionPair(nextBook) as OptionPairMap<Required<MfivOptionSummary>>

    return {
      nearBook,
      nextBook,
      nearOptionPairMap,
      nextOptionPairMap
    }
  }
}

const ensureDefaults = (o: OptionSummary): Required<OptionSummary> => {
  const { bestAskPrice, bestBidPrice, markPrice, underlyingPrice, ...rest } = o
  return {
    ...rest,
    bestAskPrice: bestAskPrice ?? 0,
    bestBidPrice: bestBidPrice ?? 0,
    markPrice: markPrice ?? 0,
    underlyingPrice: underlyingPrice ?? 0
  }
}

const validOption = (o: Required<OptionSummary>): boolean => o.bestBidPrice !== 0

const isOneOf = (...isoDateStrings: string[]) => {
  const epochs = isoDateStrings.map(str => new Date(str)).map(date => date.valueOf())
  debug("isOneOf %j", epochs)

  return (o: Required<OptionSummary>) => {
    const predicateResult = epochs.includes(o.expirationDate.valueOf())
    debug("%o includes %o = %o", epochs, o.expirationDate.valueOf(), predicateResult)
    return predicateResult
  }
  // return (o: Required<OptionSummary>) => epochs.includes(o.expirationDate.valueOf())
}

const chooseMidOrMark = (o: Required<OptionSummary>): Omit<Required<MfivOptionSummary>, "optionPrice"> => {
  if (o.bestBidPrice === 0) {
    debug("insufficient data due to bestBigPrice === 0")
    throw insufficientData("bestBidPrice missing")
  } else if (o.bestAskPrice === 0) {
    return {
      ...o,
      midPrice: o.markPrice,
      reason: "bestAskPrice missing",
      source: "mark"
    }
  } else {
    const midPrice = (o.bestAskPrice + o.bestBidPrice) / 2
    return midPrice >= 1.5 * o.markPrice
      ? {
          ...o,
          midPrice: o.markPrice,
          reason: "mid >= 1.5 * mark",
          source: "mark"
        }
      : {
          ...o,
          midPrice: midPrice,
          reason: "mid < 1.5 * mark",
          source: "mid"
        }
  }
}

const convertTo =
  (underlyingPrice: number) =>
  (o: ReturnType<typeof chooseMidOrMark>): Required<MfivOptionSummary> => {
    return { ...o, optionPrice: o.midPrice * underlyingPrice }
  }
