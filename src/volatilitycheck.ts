import { unsupportedMethodology } from "./error"
import { MfivExample, compute } from "./mfiv"
import { Context, Params } from "./types"

export class VolatilityCheck {
  /**
   * Returns whether or not the given mfiv inputs match an expected result by
   * comparing the output of the computed index value to `example.result`
   *
   * @param example - The mfiv data that produced `example.result`
   * @returns A boolean indicating whether `example.result` matches the index
   *          value computed given `example.params`
   *
   * @throws unsupportedMethodology
   * This exception is thrown when the example contains an unsupported methodology.
   *
   * @public
   */
  public isValid(example: MfivExample) {
    return this._isValid(example)
  }

  private _isValid(example: MfivExample) {
    const result = this._compute({ ...example.context }, example.params)
    const { dVol, invdVol } = result
    return dVol === example.result.dVol && invdVol === example.result.invdVol
  }

  private _compute(ctx: Context, params: Params) {
    switch (ctx.methodology) {
      case "mfiv": {
        return compute(ctx, params)
      }
      default: {
        throw unsupportedMethodology(ctx.methodology)
      }
    }
  }
}
