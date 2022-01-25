import { MfivStep2Terms } from "../types"
import { MfivStepInput } from "./mfivstep1"

/**
 * Take the weighted average of the values σ1 and σ2 obtained in Step2 for the
 * near-expiration options and the next-expiration options and compute IV
 */
export class MfivStep3 {
  run({ step2Terms }: MfivStepInput & { step2Terms: MfivStep2Terms }) {
    const { NT1, NT2, N14, N365 } = step2Terms
    const A = (NT2 - N14) / (NT2 - NT1)
    const B = (N14 - NT1) / (NT2 - NT1)
    const C = N365 / N14
    const res = Math.sqrt((step2Terms.nearModSigmaSquared * A + step2Terms.nextModSigmaSquared * B) * C)
    const intermediates = { ...step2Terms, A, B, C }
    const estimate = res * 100
    return {
      intermediates,
      dVol: estimate,
      invdVol: (1 / res) * 100.0,
      value: estimate
    }
  }
}
