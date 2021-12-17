"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatilityCheck = void 0;
const error_1 = require("./error");
const mfiv_1 = require("./mfiv");
class VolatilityCheck {
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
    isValid(example) {
        return this._isValid(example);
    }
    _isValid(example) {
        const result = this._compute({ ...example.context }, example.params);
        const { dVol, invdVol } = result;
        return dVol === example.result.dVol && invdVol === example.result.invdVol;
    }
    _compute(ctx, params) {
        switch (ctx.methodology) {
            case "mfiv": {
                return (0, mfiv_1.compute)(ctx, params);
            }
            default: {
                throw (0, error_1.unsupportedMethodology)(ctx.methodology);
            }
        }
    }
}
exports.VolatilityCheck = VolatilityCheck;
