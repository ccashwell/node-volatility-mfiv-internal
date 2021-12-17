"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfivStep2 = void 0;
const tslib_1 = require("tslib");
const dayjs_1 = (0, tslib_1.__importDefault)(require("dayjs"));
const constants_1 = require("../constants");
const error_1 = require("../error");
/**
 * Step 2 of the MFIV calculation
 *
 * Forward strike (K*) - Step 2a
 * Forward level (F = K* + e^(RT) ∙ (C* - P*)) - Step 2b
 * At-the-money strike price (K0) - Step 2c
 *
 */
class MfivStep2 {
    /**
     *
     * @param ctx - Context object containing the R and T values for step 2b
     * @param params - MfivParams object
     * @param optionExpiries - a hash partitioned into near and next expiries
     * @param optionsMap - a map from an option pair (common by strikePrice and expiration)
     *                      identifier and a [call, put] option tuple
     */
    constructor(ctx, params, expiries) {
        this.ctx = ctx;
        this.params = params;
        this.expiries = expiries;
        this.nowMs = dayjs_1.default.utc(params.at).valueOf();
        this.underlyingPrice = params.underlyingPrice;
    }
    run() {
        const nearPairs = Array.from(this.expiries.nearOptionMap.values());
        const nextPairs = Array.from(this.expiries.nextOptionMap.values());
        const NT1 = Date.parse(this.params.nearDate) - this.nowMs;
        const NT2 = Date.parse(this.params.nextDate) - this.nowMs;
        const N14 = dayjs_1.default.duration({ weeks: 2 }).asMilliseconds();
        const N365 = dayjs_1.default.duration({ years: 1 }).asMilliseconds();
        const T1 = NT1 / N365;
        const T2 = NT2 / N365;
        const FS1 = this.forwardStrike(nearPairs);
        const FS2 = this.forwardStrike(nextPairs);
        const F1 = this.forwardLevel(FS1);
        const F2 = this.forwardLevel(FS2);
        const nearForwardStrike = this.atTheMoneyStrikePrice(this.expiries.nearBook, F1);
        const nextForwardStrike = this.atTheMoneyStrikePrice(this.expiries.nextBook, F2);
        const nearFinalBook = finalBookGet(this.expiries.nearBook, nearForwardStrike);
        const nextFinalBook = finalBookGet(this.expiries.nextBook, nextForwardStrike);
        const nearContribution = contributionGet(nearFinalBook);
        const nextContribution = contributionGet(nextFinalBook);
        const nearModSigmaSquared = Math.E ** (this.ctx.risklessRate * T1) * 2 * nearContribution - (F1 / nearForwardStrike - 1) ** 2;
        const nextModSigmaSquared = Math.E ** (this.ctx.risklessRate * T2) * 2 * nextContribution - (F2 / nextForwardStrike - 1) ** 2;
        const intermediates = {
            NT1,
            NT2,
            N14,
            N365,
            T1,
            T2,
            F1,
            F2,
            nearForwardStrike,
            nextForwardStrike,
            nearOptions: this.expiries.nearBook,
            nextOptions: this.expiries.nextBook,
            nearContribution,
            nextContribution,
            nearModSigmaSquared,
            nextModSigmaSquared
        };
        return intermediates;
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
        return strike;
    }
    /**
     * (step 2b) Determine the forward level: F = K* + e^(RT) ∙ (C* - P*)
     *
     * @returns number
     */
    forwardLevel(forwardStrike) {
        // console.log("forwardLevel fs", forwardStrike)
        // forward strike price
        const kStar = forwardStrike.strikePrice;
        // price for the call option with strike K∗
        const cStar = forwardStrike.callPrice;
        // price for the put options with strike K∗
        const pStar = forwardStrike.putPrice;
        // annual risk-free interest rate.
        const R = this.ctx.risklessRate;
        // time to expiration in years
        const T = (forwardStrike.expirationDate.valueOf() - this.nowMs) / constants_1.YEAR_IN_MILLISECONDS;
        //console.log("forwardLevel", [kStar, cStar, pStar, R, T])
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
        // console.log("adjacentStrikeGet", [forwardLevelPrice])
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
        return optionPairs.reduce((previous, current) => {
            const cDiff = current.diff(), pDiff = previous.diff();
            if (cDiff && pDiff) {
                return cDiff < pDiff ? current : previous;
            }
            else {
                return previous;
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
        price: (final.avg[0][1].price + final.avg[1][1].price) / 2
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
        thisPrice = value[1].price;
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
