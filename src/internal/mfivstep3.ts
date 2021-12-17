import dayjs from "dayjs"
import { MfivContext, MfivParams } from "../mfiv"
import { MfivStep2Intermediates } from "./mfivstep2"

/**
 * Take the weighted average of the values σ12 and σ2 obtained in Step2 for the
 * near-expiration options and the next-expiration options and compute IV
 */
export class MfivStep3 {
  private readonly nowMs: number

  constructor(
    private ctx: MfivContext,
    private params: MfivParams,
    private options: {
      intermediates: MfivStep2Intermediates
    }
  ) {
    this.nowMs = dayjs.utc(params.at).valueOf()
  }

  run() {
    const step2Intermediates = this.options.intermediates
    const { NT1, NT2, N14, N365 } = step2Intermediates
    const A = (NT2 - N14) / (NT2 - NT1)
    const B = (N14 - NT1) / (NT2 - NT1)
    const C = N365 / N14
    const res = Math.sqrt((step2Intermediates.nearModSigmaSquared * A + step2Intermediates.nextModSigmaSquared * B) * C)
    const intermediates = { ...step2Intermediates, A, B, C }
    return { intermediates, dVol: res * 100, invdVol: (1 / res) * 100.0 }
  }
}
