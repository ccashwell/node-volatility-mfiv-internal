"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfivStep3 = void 0;
const tslib_1 = require("tslib");
const dayjs_1 = (0, tslib_1.__importDefault)(require("dayjs"));
/**
 * Take the weighted average of the values σ12 and σ2 obtained in Step2 for the
 * near-expiration options and the next-expiration options and compute IV
 */
class MfivStep3 {
    constructor(ctx, params, options) {
        this.ctx = ctx;
        this.params = params;
        this.options = options;
        this.nowMs = dayjs_1.default.utc(params.at).valueOf();
    }
    run() {
        const step2Intermediates = this.options.intermediates;
        const { NT1, NT2, N14, N365 } = step2Intermediates;
        const A = (NT2 - N14) / (NT2 - NT1);
        const B = (N14 - NT1) / (NT2 - NT1);
        const C = N365 / N14;
        const res = Math.sqrt((step2Intermediates.nearModSigmaSquared * A + step2Intermediates.nextModSigmaSquared * B) * C);
        const intermediates = { ...step2Intermediates, A, B, C };
        return { intermediates, dVol: res * 100, invdVol: (1 / res) * 100.0 };
    }
}
exports.MfivStep3 = MfivStep3;
