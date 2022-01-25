import { MfivContext, MfivParams } from "../mfiv";
import { Expiries, MfivOptionSummary } from "../types";
export interface MfivStepInput {
    context: MfivContext;
    params: MfivParams;
    expiries?: Expiries<MfivOptionSummary>;
}
export declare class MfivStep1 {
    run(input: MfivStepInput): Expiries<MfivOptionSummary>;
}
//# sourceMappingURL=mfivstep1.d.ts.map