import { pipe } from "@nozzlegear/railway"
import { chainFrom } from "transducist"
import { MfivParams } from "../mfiv"
import { optionSummaryToMfivOption } from "../models/mapper"
import { OptionPair } from "../models/optionpair"
import { MfivOptionSummary, OptionSummary } from "../types"
import { asNumberOrUndefined } from "../utils"
import { Expiries } from "./mfivstep2"

export class MfivStep1 {
  constructor(private readonly params: MfivParams) {}

  run(): Expiries {
    const underlyingPrice = this.params.underlyingPrice
    const { nearDate, nextDate, options } = this.params
    const partitions = pipe(options).chain(partitionByNearAndNext(nearDate, nextDate, underlyingPrice)).value()
    const nearBook = partitions.nearBook
    const nextBook = partitions.nextBook
    const expiries = {
      nearBook: nearBook,
      nextBook: nextBook,
      nearOptionMap: toOptionsMap(partitions.nearBook),
      nextOptionMap: toOptionsMap(partitions.nextBook)
    }
    return expiries
  }
}

const isNearOrNext = (nearUnixDate: number, nextUnixDate: number) => {
  return (o: OptionSummary) => {
    const expUnixMs = o.expirationDate.valueOf()
    return expUnixMs === nearUnixDate || expUnixMs === nextUnixDate
  }
}

const hasValidBidPrice = (o: OptionSummary) => {
  return asNumberOrUndefined(o.bestBidPrice) !== undefined
}

const isNearOrNextAndHasBidPrice = (nearUnixDate: number, nextUnixDate: number) => {
  const _isNearOrNext = isNearOrNext(nearUnixDate, nextUnixDate)
  return (o: OptionSummary) => _isNearOrNext(o) && hasValidBidPrice(o)
}

const partitionByNearAndNext =
  (nearIsoDateString: string, nextIsoDateString: string, underlyingPrice: number) =>
  (options: Array<OptionSummary>) => {
    const nearDate = new Date(nearIsoDateString).valueOf()
    const nextDate = new Date(nextIsoDateString).valueOf()

    const partitions = chainFrom(options)
      .filter(isNearOrNextAndHasBidPrice(nearDate, nextDate))
      .map(optionSummaryToMfivOption(underlyingPrice))
      .toObjectGroupBy(o => o.expirationDate.toISOString())
    return { nearBook: partitions[nearIsoDateString] ?? [], nextBook: partitions[nextIsoDateString] ?? [] }
  }

const toOptionsMap = (options: MfivOptionSummary[]) => {
  return options.reduce((acc, current) => {
    const symbolRoot = current.symbol.slice(0, -2)
    const pair =
      acc.get(symbolRoot) ??
      new OptionPair({
        symbol: current.symbol,
        strikePrice: current.strikePrice,
        expirationDate: current.expirationDate,
        callOption: undefined,
        putOption: undefined
      })

    if (current.optionType == "call") {
      pair.call = current
    } else {
      pair.put = current
    }

    return acc.set(symbolRoot, pair)
  }, new Map<string, OptionPair>())
}
