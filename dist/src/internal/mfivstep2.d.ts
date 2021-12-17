import { MfivContext, MfivParams } from "../mfiv";
import { OptionPair } from "../models/optionpair";
import { MfivOptionSummary, OptionPairMap } from "../types";
/**
 * Step 2 of the MFIV calculation
 *
 * Forward strike (K*) - Step 2a
 * Forward level (F = K* + e^(RT) ∙ (C* - P*)) - Step 2b
 * At-the-money strike price (K0) - Step 2c
 *
 */
export declare class MfivStep2 {
    private readonly ctx;
    private readonly params;
    private expiries;
    private readonly nowMs;
    private readonly underlyingPrice;
    /**
     *
     * @param ctx - Context object containing the R and T values for step 2b
     * @param params - MfivParams object
     * @param optionExpiries - a hash partitioned into near and next expiries
     * @param optionsMap - a map from an option pair (common by strikePrice and expiration)
     *                      identifier and a [call, put] option tuple
     */
    constructor(ctx: MfivContext, params: MfivParams, expiries: Expiries);
    run(): MfivStep2Intermediates;
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
    forwardStrike(options: OptionPair[]): OptionPair;
    /**
     * (step 2b) Determine the forward level: F = K* + e^(RT) ∙ (C* - P*)
     *
     * @returns number
     */
    forwardLevel(forwardStrike: OptionPair): number;
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
export declare type Expiries = {
    nearOptionMap: OptionPairMap;
    nextOptionMap: OptionPairMap;
    nearBook: MfivOptionSummary[];
    nextBook: MfivOptionSummary[];
};
export declare type MfivStep2Intermediates = {
    NT1: number;
    NT2: number;
    N14: number;
    N365: number;
    T1: number;
    T2: number;
    F1: number;
    F2: number;
    nearForwardStrike: number;
    nextForwardStrike: number;
    nearOptions: MfivOptionSummary[];
    nextOptions: MfivOptionSummary[];
    nearContribution: number;
    nextContribution: number;
    nearModSigmaSquared: number;
    nextModSigmaSquared: number;
};
//# sourceMappingURL=mfivstep2.d.ts.map