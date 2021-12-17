"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionPair = void 0;
/**
 * Represents a pairing of a put and call option at the same strike and expiration.
 *
 * The only guarantee is that either the call, put, or both are contained in an instance.
 * There are no requirements that an instance contains both a call and a put.
 */
class OptionPair {
    constructor({ symbol, strikePrice, expirationDate, callOption = undefined, putOption = undefined }) {
        this.symbol = symbol;
        this.callOption = callOption;
        this.putOption = putOption;
        this.strikePrice = strikePrice;
        this.expirationDate = expirationDate;
    }
    /**
     * Call option getter/setter
     *
     * @returns MidBookItemCall
     */
    get call() {
        return this.callOption;
    }
    set call(item) {
        this.callOption = item;
    }
    /**
     * Put option getter/setter
     *
     * @returns MidBookItemPut
     */
    get put() {
        return this.putOption;
    }
    set put(item) {
        this.putOption = item;
    }
    /**
     * Get the call option's price
     *
     * @returns number | undefined
     */
    get callPrice() {
        return this.call?.mfivPrice;
    }
    /**
     * Get the put option's mid price
     *
     * @returns number | undefined
     */
    get putPrice() {
        return this.put?.mfivPrice;
    }
    get hasCall() {
        return !!this.call;
    }
    get hasPut() {
        return !!this.put;
    }
    /**
     * Compute the absolute difference
     *
     * @returns number | NaN
     */
    diff() {
        if (this.callPrice && this.putPrice) {
            return Math.abs(this.callPrice - this.putPrice);
        }
        return NaN;
    }
}
exports.OptionPair = OptionPair;
