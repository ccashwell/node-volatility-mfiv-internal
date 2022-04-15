import { MfivOptionPair } from "../models/mfivoptionpair";
import { OptionPair } from "../models/optionpair";
import { Expiries, MfivOptionSummary, MfivStep2Terms } from "../types";
import { MfivStepInput } from "./mfivstep1";
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
export declare class MfivStep2 {
    /**
     *
     * @param ctx - Context object containing the R and T values for step 2b
     * @param params - MfivParams object
     * @param expiries - options partitioned into near and next expiries
     */
    run({ context, params, expiries }: MfivStepInput & {
        expiries: Expiries<Required<MfivOptionSummary>>;
    }): MfivStep2Terms;
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
    forwardStrike(options: OptionPair<Required<MfivOptionSummary>>[]): MfivOptionPair;
    /**
     * (step 2b) Determine the forward level: F = K* + e^(RT) ∙ (C* - P*)
     *
     * @returns number
     */
    forwardLevel({ risklessRate, nowEpoch }: {
        risklessRate: number;
        nowEpoch: number;
    }, forwardStrike: MfivOptionPair): number;
    /**
     * (step 2c) Determine at-the-money strike price K0.
     *
     * This is defined as the greatest strike price less than or equal to the forward level F
     *
     * @returns number
     */
    atTheMoneyStrikePrice(options: Required<MfivOptionSummary>[], forwardLevelPrice: number): number;
    /**
     * (step 2a continued)
     *
     * @returns OptionPricePair (options strike) with the smallest absolute difference among all the option pairs
     * @private
     */
    private strikeWithSmallestDiff;
}
//# sourceMappingURL=mfivstep2.d.ts.map