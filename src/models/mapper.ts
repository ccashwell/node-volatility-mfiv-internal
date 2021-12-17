import { insufficientData } from "../error"
import { MfivOptionSummary, OptionSummary } from "../types"

export const optionSummaryToMfivOption = (underlyingPrice: number) => (optionSummary: OptionSummary) => {
  const { bestAskPrice, bestBidPrice, markPrice } = optionSummary
  const midOrMark = midOrMarkPrice({ bestAskPrice, bestBidPrice, markPrice })
  const { mfivPrice, midPrice, reason, source } = midOrMark
  return {
    price: underlyingPrice * mfivPrice,
    mfivPrice,
    midPrice,
    reason,
    source,
    ...optionSummary
  } as MfivOptionSummary
}

/**
 * Compute the price of an option and
 *
 * @param obj An object with an interface able to calculate the mid of an option
 * @returns a value for either the mid, mark, or undefined
 *
 * @private
 */
export const midOrMarkPrice = ({
  bestAskPrice,
  bestBidPrice,
  markPrice
}: {
  bestAskPrice: number | undefined
  bestBidPrice: number | undefined
  markPrice: number
}) => {
  const bid = bestBidPrice,
    ask = bestAskPrice,
    mark = markPrice

  if (!bid || bid === 0) {
    throw insufficientData("bestBidPrice missing")
  } else if (!ask) {
    return { mfivPrice: markPrice, midPrice: undefined, reason: "bestAskPrice missing", source: "mark", markPrice }
  } else {
    const mid = (ask + bid) / 2
    const result =
      mid >= 1.5 * mark
        ? { mfivPrice: markPrice, midPrice: mid, reason: "mid >= 1.5 * mark", source: "mark", markPrice }
        : { mfivPrice: mid, midPrice: mid, reason: "mid < 1.5 * mark", source: "mid", markPrice }
    return result
  }
}
