import { EXCHANGES, METHODOLOGIES, VERSIONS, CURRENCIES } from "./constants";
import { MfivContext, MfivParams, MfivResult, MfivExample } from "./mfiv";
import { OptionPair } from "./models/optionpair";
export declare type Version = typeof VERSIONS[number];
export declare type Currency = typeof CURRENCIES[number];
export declare type Exchange = typeof EXCHANGES[number];
export declare type Methodology = typeof METHODOLOGIES[number];
export declare type MethodologyExample<V extends Version, C extends Context, P extends Params, R extends Result> = {
    version: V;
    context: C;
    params: P;
    result: R;
};
export declare type Example = MfivExample;
export declare type OptionSummary = {
    readonly symbol: string;
    readonly timestamp: Date;
    readonly optionType: "put" | "call";
    readonly expirationDate: Date;
    readonly strikePrice: number;
    readonly bestBidPrice: number | undefined;
    readonly bestAskPrice: number | undefined;
    readonly markPrice: number;
    readonly underlyingPrice: number;
};
export declare type BaseContext = {
    readonly methodology: Methodology;
    readonly exchange: Exchange;
    readonly currency: Currency;
};
export declare type IndexResult = {
    dVol: number | undefined;
    invdVol: number | undefined;
};
export declare type Context = MfivContext;
export declare type Params = MfivParams;
export declare type Result = MfivResult;
export declare type OptionPairMap = Map<string, OptionPair>;
export declare type MidOrMarkType = {
    mfivPrice: number;
    midPrice?: number;
    markPrice: number;
    source: "mid" | "mark";
    reason: "mid >= 1.5 * mark" | "bestAskPrice missing" | "mid < 1.5 * mark";
};
export declare type MfivOptionSummary = Required<Pick<OptionSummary, "underlyingPrice" | "bestAskPrice" | "bestBidPrice">> & MidOrMarkType & {
    underlyingPrice: number;
} & Omit<OptionSummary, "underlyingPrice" | "bestAskPrice" | "bestBidPrice"> & {
    price: number;
};
//# sourceMappingURL=types.d.ts.map