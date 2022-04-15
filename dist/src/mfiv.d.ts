import { BaseContext, MfivDuration, MfivResult, OptionSummary } from "./types";
/**
 * Compute the volatility index value for the given mfiv context and model parameters
 *
 * @param ctx Methodology context object
 * @param params Inputs for calculating the index
 * @returns a result object containing the index value and its intermediates
 */
export declare function compute(context: MfivContext, params: MfivParams): MfivResult;
export declare type MfivContext = BaseContext & {
    readonly timePeriod: MfivDuration;
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
    /** Use a fixed underlying price */
    underlyingPrice: number;
};
//# sourceMappingURL=mfiv.d.ts.map