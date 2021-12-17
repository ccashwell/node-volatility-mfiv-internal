import { MFIV_WINDOW_INTERVALS } from "./constants";
import { BaseContext, IndexResult, MethodologyExample, MfivOptionSummary, OptionSummary } from "./types";
/**
 * Compute the volatility index value for the given mfiv context and model parameters
 *
 * @param ctx Methodology context object
 * @param params Inputs for calculating the index
 * @returns a result object containing the index value and its intermediates
 */
export declare function compute(ctx: MfivContext, params: MfivParams): {
    intermediates: {
        A: number;
        B: number;
        C: number;
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
    dVol: number;
    invdVol: number;
};
export declare type MfivExample = MethodologyExample<"2022-01-01", MfivContext, MfivParams, MfivResult>;
export declare type MfivWindowInterval = typeof MFIV_WINDOW_INTERVALS[number];
export declare type MfivContext = BaseContext & {
    readonly windowInterval: MfivWindowInterval;
    readonly risklessRate: number;
    readonly risklessRateAt: string;
    readonly risklessRateSource: string;
};
export declare type MfivParams = {
    /** t0 value */
    at: string;
    /** options expiring at 8:00AM UTC on the friday after t0 */
    nearDate: string;
    /** options expiring at 8:00AM UTC on the friday preceeding t14 */
    nextDate: string;
    /** Options having an expiration matching nearDate OR nextDate  */
    options: Array<OptionSummary>;
    /** Keep a fixed underlying price */
    underlyingPrice: number;
};
export declare type MfivIntermediates = {
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
    nearMid: MfivOptionSummary[];
    nextMid: MfivOptionSummary[];
    nearContribution: number;
    nextContribution: number;
    nearModSigmaSquared: number;
    nextModSigmaSquared: number;
    A: number;
    B: number;
    C: number;
};
export declare type MfivResult = IndexResult & {
    intermediates?: MfivIntermediates;
};
//# sourceMappingURL=mfiv.d.ts.map