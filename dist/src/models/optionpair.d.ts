import { MfivOptionSummary } from "../types";
interface IOptionPair {
    symbol: string;
    strikePrice: number;
    expirationDate: Date;
    callOption: MfivOptionSummary | undefined;
    putOption: MfivOptionSummary | undefined;
}
/**
 * Represents a pairing of a put and call option at the same strike and expiration.
 *
 * The only guarantee is that either the call, put, or both are contained in an instance.
 * There are no requirements that an instance contains both a call and a put.
 */
export declare class OptionPair implements IOptionPair {
    symbol: string;
    callOption: MfivOptionSummary | undefined;
    putOption: MfivOptionSummary | undefined;
    strikePrice: number;
    expirationDate: Date;
    constructor({ symbol, strikePrice, expirationDate, callOption, putOption }: IOptionPair);
    /**
     * Call option getter/setter
     *
     * @returns MidBookItemCall
     */
    get call(): MfivOptionSummary | undefined;
    set call(item: MfivOptionSummary | undefined);
    /**
     * Put option getter/setter
     *
     * @returns MidBookItemPut
     */
    get put(): MfivOptionSummary | undefined;
    set put(item: MfivOptionSummary | undefined);
    /**
     * Get the call option's price
     *
     * @returns number | undefined
     */
    get callPrice(): number | undefined;
    /**
     * Get the put option's mid price
     *
     * @returns number | undefined
     */
    get putPrice(): number | undefined;
    get hasCall(): boolean;
    get hasPut(): boolean;
    /**
     * Compute the absolute difference
     *
     * @returns number | NaN
     */
    diff(): number;
}
export {};
//# sourceMappingURL=optionpair.d.ts.map