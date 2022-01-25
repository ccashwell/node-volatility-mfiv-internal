import dayjs from "dayjs"
import Duration from "dayjs/plugin/duration"
import { YEAR_IN_MILLISECONDS } from "../constants"
import { insufficientData } from "../error"
import { MfivOptionPair } from "../models/mfivoptionpair"
import { OptionPair } from "../models/optionpair"
import { Expiries, MfivOptionSummary, MfivStep2Terms, OptionSummary } from "../types"
import { MfivStepInput } from "./mfivstep1"

dayjs.extend(Duration)

/**
 * Step 2 of the MFIV calculation
 *
 * Forward strike (K*) - Step 2a
 * Forward level (F = K* + e^(RT) ∙ (C* - P*)) - Step 2b
 * At-the-money strike price (K0) - Step 2c
 *
 */
export class MfivStep2 {
  /**
   *
   * @param ctx - Context object containing the R and T values for step 2b
   * @param params - MfivParams object
   * @param expiries - options partitioned into near and next expiries
   */
  run({
    context,
    params,
    expiries
  }: MfivStepInput & {
    expiries: Expiries<MfivOptionSummary>
  }) {
    const risklessRate = context.risklessRate
    const nowEpoch = Date.parse(params.at)
    const forwardLevelOptions = { risklessRate, nowEpoch }
    const nearPairs = Array.from(expiries.nearOptionPairMap.values())
    const nextPairs = Array.from(expiries.nextOptionPairMap.values())
    const NT1 = Date.parse(params.nearDate) - nowEpoch
    const NT2 = Date.parse(params.nextDate) - nowEpoch
    const N14 = dayjs.duration({ weeks: 2 }).asMilliseconds()
    const N365 = dayjs.duration({ years: 1 }).asMilliseconds()
    const T1 = NT1 / N365
    const T2 = NT2 / N365
    const FS1 = this.forwardStrike(nearPairs)
    const FS2 = this.forwardStrike(nextPairs)
    const F1 = this.forwardLevel(forwardLevelOptions, FS1)
    const F2 = this.forwardLevel(forwardLevelOptions, FS2)
    const nearForwardStrike = this.atTheMoneyStrikePrice(expiries.nearBook, F1)
    const nextForwardStrike = this.atTheMoneyStrikePrice(expiries.nextBook, F2)
    const nearFinalBook = finalBookGet(expiries.nearBook, nearForwardStrike)
    const nextFinalBook = finalBookGet(expiries.nextBook, nextForwardStrike)
    const nearContribution = contributionGet(nearFinalBook)
    const nextContribution = contributionGet(nextFinalBook)
    const nearModSigmaSquared = Math.E ** (risklessRate * T1) * 2 * nearContribution - (F1 / nearForwardStrike - 1) ** 2
    const nextModSigmaSquared = Math.E ** (risklessRate * T2) * 2 * nextContribution - (F2 / nextForwardStrike - 1) ** 2
    return {
      finalNearBook: nearFinalBook,
      finalNextBook: nextFinalBook,
      NT1,
      NT2,
      N14,
      N365,
      T1,
      T2,
      FS1: FS1.strikePrice,
      FS2: FS2.strikePrice,
      F1,
      F2,
      nearForwardStrike,
      nextForwardStrike,
      nearContribution,
      nextContribution,
      nearModSigmaSquared,
      nextModSigmaSquared
    } as MfivStep2Terms
  }

  /**
   * (step 2a) Determine the forward strike K*
   *
   * This is defined as the strike for which the prices for the call and put
   * options at that strike have the smallest absolute difference among all the pairs
   * of options.
   *
   * @returns OptionPair or undefined if not enough data is present
   *
   * @throws {@link Failure<VolatilityError.InsufficientData>}
   */
  forwardStrike(options: OptionPair<MfivOptionSummary>[]) {
    const strike = this.strikeWithSmallestDiff(options)

    if (!strike) {
      throw insufficientData("No forward price. Should occur at burn-in only!")
    }

    return strike
  }

  /**
   * (step 2b) Determine the forward level: F = K* + e^(RT) ∙ (C* - P*)
   *
   * @returns number
   */
  forwardLevel({ risklessRate, nowEpoch }: { risklessRate: number; nowEpoch: number }, forwardStrike: MfivOptionPair) {
    // forward strike price
    const kStar = forwardStrike.strikePrice
    // price for the call option with strike K∗
    const cStar = forwardStrike.$call as number
    // price for the put options with strike K∗
    const pStar = forwardStrike.$put as number
    // annual risk-free interest rate.
    const R = risklessRate
    // time to expiration in years
    const T = (forwardStrike.expirationDate.valueOf() - nowEpoch) / YEAR_IN_MILLISECONDS

    return kStar + Math.E ** (R * T) * (cStar - pStar)
  }

  /**
   * (step 2c) Determine at-the-money strike price K0.
   *
   * This is defined as the greatest strike price less than or equal to the forward level F
   *
   * @returns number
   */
  atTheMoneyStrikePrice(options: MfivOptionSummary[], forwardLevelPrice: number) {
    return options.reduce((adjacentStrike: number, current: MfivOptionSummary) => {
      if (current.strikePrice <= forwardLevelPrice && current.strikePrice > adjacentStrike) {
        adjacentStrike = current.strikePrice
      }

      return adjacentStrike
    }, 0.0)
  }

  /**
   * (step 2a continued)
   *
   * @returns OptionPricePair (options strike) with the smallest absolute difference among all the option pairs
   * @private
   */
  private strikeWithSmallestDiff(optionPairs: MfivOptionPair[]) {
    return optionPairs.reduce((previous, current) => {
      const cDiff = current.diff(),
        pDiff = previous.diff()

      if (isNaN(pDiff) && !isNaN(cDiff)) {
        return current
      } else if (pDiff && isNaN(cDiff)) {
        return previous
      } else {
        return pDiff < cDiff ? previous : current
      }
    })
  }
}

const isCallOption = (o: { optionType: "call" | "put" }) => o.optionType === "call"
const isPutOption = (o: { optionType: "call" | "put" }) => o.optionType === "put"
const isPutBelowStrike = (targetStrike: number) => (o: OptionSummary) => isPutOption(o) && o.strikePrice < targetStrike
const isCallAboveStrike = (targetStrike: number) => (o: OptionSummary) =>
  isCallOption(o) && o.strikePrice > targetStrike

const finalBookGet = (entries: MfivOptionSummary[], targetStrike: number) => {
  const final = entries.reduce(
    (acc, option) => {
      // find the puts below the strike, the calls above the strike, and both the put and call AT the strike
      if (isPutBelowStrike(targetStrike)(option) || isCallAboveStrike(targetStrike)(option)) {
        acc.book.push([option.symbol, option])
      } else if (option.strikePrice === targetStrike) {
        acc.avg.push([option.symbol, option])
      }

      return acc
    },
    { avg: [] as [string, MfivOptionSummary][], book: [] as [string, MfivOptionSummary][] }
  )

  // add to the list the average of the call and put prices at the strike
  const avgOption = {
    ...final.avg[0][1],
    optionPrice: (final.avg[0][1].optionPrice + final.avg[1][1].optionPrice) / 2
  }

  final.book.push([avgOption.symbol + "AV", avgOption])

  // sort by strike price
  return final.book.sort((a, b) => {
    return a[1].strikePrice - b[1].strikePrice
  })
}

const contributionGet = (finalBook: [string, MfivOptionSummary][]) => {
  let thisStrike: number, nextStrike: number, previousStrike: number, deltaK: number, thisPrice: number
  let contribution = 0

  finalBook.forEach((value, idx, arr) => {
    thisStrike = Number(value[1].strikePrice)
    thisPrice = value[1].optionPrice ?? 0

    if (idx === 0) {
      nextStrike = Number(arr[idx + 1][1].strikePrice)
      deltaK = nextStrike - thisStrike
    } else if (idx === arr.length - 1) {
      previousStrike = Number(arr[idx - 1][1].strikePrice)
      deltaK = thisStrike - previousStrike
    } else {
      previousStrike = Number(arr[idx - 1][1].strikePrice)
      nextStrike = Number(arr[idx + 1][1].strikePrice)
      deltaK = (nextStrike - previousStrike) / 2
    }

    contribution = contribution + (deltaK / thisStrike ** 2) * thisPrice
  })

  return contribution
}
