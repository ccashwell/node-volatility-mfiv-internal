"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfivStep3 = void 0;
/**
 * Take the weighted average of the values σ1 and σ2 obtained in Step2 for the
 * near-expiration options and the next-expiration options and compute IV
 */
class MfivStep3 {
    run({ step2Terms }) {
        const { NT1, NT2, TP, N365 } = step2Terms;
        const A = (NT2 - TP) / (NT2 - NT1);
        const B = (TP - NT1) / (NT2 - NT1);
        const C = N365 / TP;
        const res = Math.sqrt((step2Terms.nearModSigmaSquared * A + step2Terms.nextModSigmaSquared * B) * C);
        const intermediates = { ...step2Terms, A, B, C };
        const estimate = res * 100;
        return {
            intermediates,
            dVol: estimate,
            invdVol: (1 / res) * 100.0,
            value: estimate
        };
    }
}
exports.MfivStep3 = MfivStep3;
