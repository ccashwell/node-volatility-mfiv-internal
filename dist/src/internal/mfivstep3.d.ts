import { MfivStep2Terms } from "../types";
import { MfivStepInput } from "./mfivstep1";
/**
 * Take the weighted average of the values σ1 and σ2 obtained in Step2 for the
 * near-expiration options and the next-expiration options and compute IV
 */
export declare class MfivStep3 {
    run({ step2Terms }: MfivStepInput & {
        step2Terms: MfivStep2Terms;
    }): {
        intermediates: {
            A: number;
            B: number;
            C: number;
            finalNearBook: [string, import("./types_2022_03_22").MfivOptionSummary][];
            finalNextBook: [string, import("./types_2022_03_22").MfivOptionSummary][];
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
            nearContribution: number;
            nextContribution: number;
            nearModSigmaSquared: number;
            nextModSigmaSquared: number;
        };
        dVol: number;
        invdVol: number;
        value: number;
    };
}
//# sourceMappingURL=mfivstep3.d.ts.map