import { MfivOptionSummary, OptionSummary } from "../types";
export declare const optionSummaryToMfivOption: (underlyingPrice: number) => (optionSummary: OptionSummary) => MfivOptionSummary;
/**
 * Compute the price of an option and
 *
 * @param obj An object with an interface able to calculate the mid of an option
 * @returns a value for either the mid, mark, or undefined
 *
 * @private
 */
export declare const midOrMarkPrice: ({ bestAskPrice, bestBidPrice, markPrice }: {
    bestAskPrice: number | undefined;
    bestBidPrice: number | undefined;
    markPrice: number;
}) => {
    mfivPrice: number;
    midPrice: number;
    reason: string;
    source: string;
    markPrice: number;
} | {
    mfivPrice: number;
    midPrice: undefined;
    reason: string;
    source: string;
    markPrice: number;
};
//# sourceMappingURL=mapper.d.ts.map