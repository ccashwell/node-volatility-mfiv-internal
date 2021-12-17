import { MfivOptionSummary } from "../types"

interface IOptionPair {
  symbol: string
  strikePrice: number
  expirationDate: Date
  callOption: MfivOptionSummary | undefined
  putOption: MfivOptionSummary | undefined
}

/**
 * Represents a pairing of a put and call option at the same strike and expiration.
 *
 * The only guarantee is that either the call, put, or both are contained in an instance.
 * There are no requirements that an instance contains both a call and a put.
 */
export class OptionPair implements IOptionPair {
  symbol: string
  callOption: MfivOptionSummary | undefined
  putOption: MfivOptionSummary | undefined
  strikePrice: number
  expirationDate: Date

  constructor({ symbol, strikePrice, expirationDate, callOption = undefined, putOption = undefined }: IOptionPair) {
    this.symbol = symbol
    this.callOption = callOption
    this.putOption = putOption
    this.strikePrice = strikePrice
    this.expirationDate = expirationDate
  }

  /**
   * Call option getter/setter
   *
   * @returns MidBookItemCall
   */
  get call(): MfivOptionSummary | undefined {
    return this.callOption
  }
  set call(item: MfivOptionSummary | undefined) {
    this.callOption = item
  }

  /**
   * Put option getter/setter
   *
   * @returns MidBookItemPut
   */
  get put(): MfivOptionSummary | undefined {
    return this.putOption
  }
  set put(item: MfivOptionSummary | undefined) {
    this.putOption = item
  }

  /**
   * Get the call option's price
   *
   * @returns number | undefined
   */
  get callPrice() {
    return this.call?.mfivPrice
  }

  /**
   * Get the put option's mid price
   *
   * @returns number | undefined
   */
  get putPrice() {
    return this.put?.mfivPrice
  }

  get hasCall() {
    return !!this.call
  }
  get hasPut() {
    return !!this.put
  }
  /**
   * Compute the absolute difference
   *
   * @returns number | NaN
   */
  diff() {
    if (this.callPrice && this.putPrice) {
      return Math.abs(this.callPrice - this.putPrice)
    }

    return NaN
  }
}
