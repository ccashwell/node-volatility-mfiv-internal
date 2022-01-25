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
     */
    static isValid(example) {
        return VolatilityCheck.check(example).isSuccess;
    }
    static check(example) {
        const evidenceResult = example.result;
        const compare = (result) => result.dVol === evidenceResult.dVol && result.invdVol === evidenceResult.invdVol;
        const result = this._compute({ ...example.context }, example.params);
        return { isSuccess: compare(result), result: result };
    }
    static _compute(ctx, params) {
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
