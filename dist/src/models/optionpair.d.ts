import { OptionPrice, OptionSummary } from "../types";
export interface OptionPair<T extends OptionSummary & OptionPrice> {
    readonly baseSymbol: string;
    readonly strikePrice: number;
    readonly expirationDate: Date;
    call?: T;
    put?: T;
    $call: number | undefined;
    $put: number | undefined;
    insert(option: T): OptionPair<T>;
    diff(): number;
}
/**
 * Represents a pairing of a put and call option at the same strike and expiration.
 *
 * The only guarantee is that either the call, put, or both are contained in an instance.
 * There are no requirements that an instance contains both a call and a put.
 */
export declare class BaseOptionPair<T extends OptionSummary & OptionPrice> implements OptionPair<T> {
    baseSymbol: string;
    strikePrice: number;
    expirationDate: Date;
    call?: T;
    put?: T;
    constructor(baseSymbol: string, strikePrice: number, expirationDate: Date);
    insert(item: T): OptionPair<T>;
    /**
     * Get the call option's price
     *
     * @returns number | undefined
     */
    get $call(): number | undefined;
    /**
     * Get the put option's mid price
     *
     * @returns number | undefined
     */
    get $put(): number | undefined;
    /**
     * Compute the absolute difference
     *
     * @returns number | NaN
     */
    diff(): number;
}
export declare const toMapOfOptionPair: <T extends OptionSummary & OptionPrice>(options: T[]) => Map<string, OptionPair<OptionSummary & OptionPrice>>;
//# sourceMappingURL=optionpair.d.ts.map