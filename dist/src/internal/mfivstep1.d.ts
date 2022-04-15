import { MfivContext, MfivParams } from "../mfiv";
import { Expiries, MfivOptionSummary } from "../types";
export interface MfivStepInput {
    context: MfivContext;
    params: MfivParams;
    expiries?: Expiries<Required<MfivOptionSummary>>;
}
export declare class MfivStep1 {
    run(input: MfivStepInput): Expiries<Required<MfivOptionSummary>>;
}
//# sourceMappingURL=mfivstep1.d.ts.map