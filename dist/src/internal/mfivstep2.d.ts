import { MfivOptionPair } from "../models/mfivoptionpair";
import { OptionPair } from "../models/optionpair";
import { Expiries, MfivOptionSummary, MfivStep2Terms } from "../types";
import { MfivStepInput } from "./mfivstep1";
/**
 * Step 2 of the MFIV calculation
 *
 * Forward strike (K*) - Step 2a
 * Forward level (F = K* + e^(RT) ∙ (C* - P*)) - Step 2b
 * At-the-money strike price (K0) - Step 2c
 *
 */
export declare class MfivStep2 {
    /**
     *
     * @param ctx - Context object containing the R and T values for step 2b
     * @param params - MfivParams object
     * @param expiries - options partitioned into near and next expiries
     */
    run({ context, params, expiries }: MfivStepInput & {
        expiries: Expiries<MfivOptionSummary>;
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
    forwardStrike(options: OptionPair<MfivOptionSummary>[]): MfivOptionPair;
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
    atTheMoneyStrikePrice(options: MfivOptionSummary[], forwardLevelPrice: number): number;
    /**
     * (step 2a continued)
     *
     * @returns OptionPricePair (options strike) with the smallest absolute difference among all the option pairs
     * @private
     */
    private strikeWithSmallestDiff;
}
//# sourceMappingURL=mfivstep2.d.ts.map