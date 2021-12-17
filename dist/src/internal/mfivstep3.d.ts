import { MfivContext, MfivParams } from "../mfiv";
import { MfivStep2Intermediates } from "./mfivstep2";
/**
 * Take the weighted average of the values σ12 and σ2 obtained in Step2 for the
 * near-expiration options and the next-expiration options and compute IV
 */
export declare class MfivStep3 {
    private ctx;
    private params;
    private options;
    private readonly nowMs;
    constructor(ctx: MfivContext, params: MfivParams, options: {
        intermediates: MfivStep2Intermediates;
    });
    run(): {
        intermediates: {
            A: number;
            B: number;
            C: number;
            NT1: number;
            NT2: number;
            N14: number;
            N365: number;
            T1: number;
            T2: number;
            F1: number;
            F2: number;
            nearForwardStrike: number;
            nextForwardStrike: number;
            nearOptions: import("../types").MfivOptionSummary[];
            nextOptions: import("../types").MfivOptionSummary[];
            nearContribution: number;
            nextContribution: number;
            nearModSigmaSquared: number;
            nextModSigmaSquared: number;
        };
        dVol: number;
        invdVol: number;
    };
}
//# sourceMappingURL=mfivstep3.d.ts.map