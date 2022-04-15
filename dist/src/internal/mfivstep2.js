"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfivStep2 = void 0;
const tslib_1 = require("tslib");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const duration_1 = tslib_1.__importDefault(require("dayjs/plugin/duration"));
const constants_1 = require("../constants");
const debug_1 = require("../debug");
const error_1 = require("../error");
dayjs_1.default.extend(duration_1.default);
/***************************************************************************************************************************\
*                                                                                                                           *
* 2. Separately, for both the set of near-expiration options and next-expiration options:                                   *
*                                                                                                                           *
*    (a) Determine the forward strike K∗. This is defined as the strike for which the prices for the call                   *
*        and put options at that strike have the smallest absolute difference among all the pairs of options.               *
*                                                                                                                           *
*    (b) Determine the forward level:                                                                                       *
*                                                                                                                           *
*        ┌─────────────────────forward strike K∗                                                                            *
*        │                                                                                                                  *
*        │         ┌───────────C∗ is the price for the call option with strike K∗.                                          *
*        │         │                                                                                                        *
*        │         │    ┌──────P∗ is the price for the put options with strike K∗.                                          *
*        │         │    │                                                                                                   *
*        │         │    │                                                                                                   *
*        ▼         ▼    ▼                                                                                                   *
*    F = K∗ + eᴿᵀ (C∗ − P∗)                                                                                                 *
*              ▲▲                                                                                                           *
*              │└──────T is the time to expiration in years.                                                                *
*              └───────R is the annual risk-free interest rate.                                                             *
*                                                                                                                           *
*   (c) Determine the at-the-money strike price K0. This is defined as the greatest strike price less                       *
*       than or equal to the forward level F .                                                                              *
*                                                                                                                           *
*   (d) Take the midpoint prices of all put options with strike less than K0, the midpoint prices of all the                *
*       call options with strike greater than K0, and the average of the midpoint prices of the two options                 *
*       at the strike K0. We call this subset of options the admitted options and the midpoints we designate                *
*       as Q(K) for each admitted option at strike K.                                                                       *
*                                                                                                                           *
*   (e) We now calculate σ2 defined as:                                                                                     *
*                                                                                                                           *
*   2 2eRT 􏰄 ∆Ki 1 􏰀 F                                                                                                      *
*   σ = T K Q(Ki)−T K −1                                                                                                    *
*   ii0                                                                                                                     *
*                                                                                                                           *
*       where:                                                                                                              *
*        • The sum is over all admitted options.                                                                            *
*        • Q(Ki) is the midpoint price for option with strike Ki.                                                           *
*        • ∆Ki is half the difference between the strikes on either side of Ki unless Ki is the least or                    *
*          greatest admitted strike in which case ∆Ki is the difference between the adjacent strike.                        *
*        • As defined previously, T, R, F, K0 are time to expiration, risk- free interest rate, the                         *
*          forward level, and the at-the-money strike respectively.                                                         *
*                                                                                                                           *
* 3. Take the weighted average of the values σ12 and σ2 obtained in Step 2 above for the near-expiration                    *
* options and the next-expiration options:                                                                                  *
*                                                                                                                           *
*         dVOL=100× T1σ1 T −T +T2σ2 T −T × 14 (3)                                                                           *
*         21 21                                                                                                             *
*                                                                                                                           *
*       where:                                                                                                              *
*        • T1 and T2 are times until near and next expiration in (fractional) years.                                        *
*        • T14 = 14/365                                                                                                     *
*                                                                                                                           *
* We now describe two details regarding the above definition.                                                               *
*                                                                                                                           *
* 1. All midpoint values are defined as being the mean of the least ask price and the greatest bid price. If a bid price    *
* is zero then remove this option from all further calculations. If there is a non-zero bid price and no ask price the      *
* mark price is used in place of the midpoint. If the midpoint is 1.5x greater than the mark price then the mark price is   *
* used in place of the midpoint.                                                                                            *
*                                                                                                                           *
* 2. In step 1c above, in the rare case there is only one valid option price with strike K0, either call or put, use the    *
* price of the single available option in place of the average. In the even more rare case where neither the put option     *
* price nor the call option price with strike K0 are valid then the index is undefined. By arbitrage, both of these         *
* situations are very short-lived.                                                                                          *
*                                                                                                                           *
*                                                                                                                           *
\***************************************************************************************************************************/
class MfivStep2 {
    /**
     *
     * @param ctx - Context object containing the R and T values for step 2b
     * @param params - MfivParams object
     * @param expiries - options partitioned into near and next expiries
     */
    run({ context, params, expiries }) {
        const risklessRate = context.risklessRate;
        const nowEpoch = Date.parse(params.at);
        const forwardLevelOptions = { risklessRate, nowEpoch };
        const nearPairs = Array.from(expiries.nearOptionPairMap.values());
        const nextPairs = Array.from(expiries.nextOptionPairMap.values());
        const NT1 = Date.parse(params.nearDate) - nowEpoch;
        const NT2 = Date.parse(params.nextDate) - nowEpoch;
        const N14 = dayjs_1.default.duration({ weeks: 2 }).asMilliseconds();
        const N365 = dayjs_1.default.duration({ years: 1 }).asMilliseconds();
        const T1 = NT1 / N365;
        const T2 = NT2 / N365;
        const FS1 = this.forwardStrike(nearPairs);
        const FS2 = this.forwardStrike(nextPairs);
        const F1 = this.forwardLevel(forwardLevelOptions, FS1);
        const F2 = this.forwardLevel(forwardLevelOptions, FS2);
        const nearForwardStrike = this.atTheMoneyStrikePrice(expiries.nearBook, F1);
        const nextForwardStrike = this.atTheMoneyStrikePrice(expiries.nextBook, F2);
        const nearFinalBook = finalBookGet(expiries.nearBook, nearForwardStrike);
        const nextFinalBook = finalBookGet(expiries.nextBook, nextForwardStrike);
        const nearContribution = contributionGet(nearFinalBook);
        const nextContribution = contributionGet(nextFinalBook);
        const nearModSigmaSquared = Math.E ** (risklessRate * T1) * 2 * nearContribution - (F1 / nearForwardStrike - 1) ** 2;
        const nextModSigmaSquared = Math.E ** (risklessRate * T2) * 2 * nextContribution - (F2 / nextForwardStrike - 1) ** 2;
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
        };
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
    forwardStrike(options) {
        const strike = this.strikeWithSmallestDiff(options);
        if (!strike) {
            throw (0, error_1.insufficientData)("No forward price. Should occur at burn-in only!");
        }
        (0, debug_1.debug)("forwardStrike", strike);
        return strike;
    }
    /**
     * (step 2b) Determine the forward level: F = K* + e^(RT) ∙ (C* - P*)
     *
     * @returns number
     */
    forwardLevel({ risklessRate, nowEpoch }, forwardStrike) {
        // forward strike price
        const kStar = forwardStrike.strikePrice;
        // price for the call option with strike K∗
        const cStar = forwardStrike.$call;
        // price for the put options with strike K∗
        const pStar = forwardStrike.$put;
        // annual risk-free interest rate.
        const R = risklessRate;
        // time to expiration in years
        const T = (forwardStrike.expirationDate.valueOf() - nowEpoch) / constants_1.YEAR_IN_MILLISECONDS;
        return kStar + Math.E ** (R * T) * (cStar - pStar);
    }
    /**
     * (step 2c) Determine at-the-money strike price K0.
     *
     * This is defined as the greatest strike price less than or equal to the forward level F
     *
     * @returns number
     */
    atTheMoneyStrikePrice(options, forwardLevelPrice) {
        (0, debug_1.debug)("atTheMoneyStrikePrice", forwardLevelPrice);
        return options.reduce((adjacentStrike, current) => {
            if (current.strikePrice <= forwardLevelPrice && current.strikePrice > adjacentStrike) {
                adjacentStrike = current.strikePrice;
            }
            return adjacentStrike;
        }, 0.0);
    }
    /**
     * (step 2a continued)
     *
     * @returns OptionPricePair (options strike) with the smallest absolute difference among all the option pairs
     * @private
     */
    strikeWithSmallestDiff(optionPairs) {
        (0, debug_1.debug)("strikeWithSmallestDiff");
        return optionPairs.reduce((previous, current) => {
            const cDiff = current.diff(), pDiff = previous.diff();
            if (isNaN(pDiff) && !isNaN(cDiff)) {
                return current;
            }
            else if (pDiff && isNaN(cDiff)) {
                return previous;
            }
            else {
                return pDiff < cDiff ? previous : current;
            }
        });
    }
}
exports.MfivStep2 = MfivStep2;
const isCallOption = (o) => o.optionType === "call";
const isPutOption = (o) => o.optionType === "put";
const isPutBelowStrike = (targetStrike) => (o) => isPutOption(o) && o.strikePrice < targetStrike;
const isCallAboveStrike = (targetStrike) => (o) => isCallOption(o) && o.strikePrice > targetStrike;
const finalBookGet = (entries, targetStrike) => {
    (0, debug_1.debug)("finalBookGet(%d, %d)", entries.length, targetStrike);
    const final = entries.reduce((acc, option) => {
        // find the puts below the strike, the calls above the strike, and both the put and call AT the strike
        if (isPutBelowStrike(targetStrike)(option) || isCallAboveStrike(targetStrike)(option)) {
            acc.book.push([option.symbol, option]);
        }
        else if (option.strikePrice === targetStrike) {
            acc.avg.push([option.symbol, option]);
        }
        return acc;
    }, { avg: [], book: [] });
    // add to the list the average of the call and put prices at the strike
    const avgOption = {
        ...final.avg[0][1],
        optionPrice: (final.avg[0][1].optionPrice + final.avg[1][1].optionPrice) / 2
    };
    final.book.push([avgOption.symbol + "AV", avgOption]);
    // sort by strike price
    return final.book.sort((a, b) => {
        return a[1].strikePrice - b[1].strikePrice;
    });
};
const contributionGet = (finalBook) => {
    let thisStrike, nextStrike, previousStrike, deltaK, thisPrice;
    let contribution = 0;
    finalBook.forEach((value, idx, arr) => {
        thisStrike = Number(value[1].strikePrice);
        thisPrice = value[1].optionPrice;
        if (idx === 0) {
            nextStrike = Number(arr[idx + 1][1].strikePrice);
            deltaK = nextStrike - thisStrike;
        }
        else if (idx === arr.length - 1) {
            previousStrike = Number(arr[idx - 1][1].strikePrice);
            deltaK = thisStrike - previousStrike;
        }
        else {
            previousStrike = Number(arr[idx - 1][1].strikePrice);
            nextStrike = Number(arr[idx + 1][1].strikePrice);
            deltaK = (nextStrike - previousStrike) / 2;
        }
        contribution = contribution + (deltaK / thisStrike ** 2) * thisPrice;
    });
    return contribution;
};
