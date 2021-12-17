import { pipe } from "@nozzlegear/railway"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { MFIV_WINDOW_INTERVALS } from "./constants"
import { debug } from "./debug"
import { MfivStep1 } from "./internal/mfivstep1"
import { Expiries, MfivStep2, MfivStep2Intermediates } from "./internal/mfivstep2"
import { MfivStep3 } from "./internal/mfivstep3"
import { BaseContext, IndexResult, MethodologyExample, MfivOptionSummary, OptionSummary } from "./types"

dayjs.extend(duration)

/**
 * Compute the volatility index value for the given mfiv context and model parameters
 *
 * @param ctx Methodology context object
 * @param params Inputs for calculating the index
 * @returns a result object containing the index value and its intermediates
 */
export function compute(ctx: MfivContext, params: MfivParams) {
  debug("compute %s-%s-%s @ %s", ctx.methodology, ctx.currency, ctx.windowInterval, params.at)

  const step1 = () => new MfivStep1(params).run()
  const step2 = (expiries: Expiries): MfivStep2Intermediates => new MfivStep2(ctx, params, expiries).run()
  const step3 = (intermediates: MfivStep2Intermediates) =>
    new MfivStep3(ctx, params, { intermediates: intermediates }).run()

  return pipe(step1()).chain(step2).chain(step3).value()
}

export type MfivExample = MethodologyExample<"2022-01-01", MfivContext, MfivParams, MfivResult>

export type MfivWindowInterval = typeof MFIV_WINDOW_INTERVALS[number]

export type MfivContext = BaseContext & {
  readonly windowInterval: MfivWindowInterval
  readonly risklessRate: number
  readonly risklessRateAt: string
  readonly risklessRateSource: string
}

export type MfivParams = {
  /** t0 value */
  at: string
  /** options expiring at 8:00AM UTC on the friday after t0 */
  nearDate: string
  /** options expiring at 8:00AM UTC on the friday preceeding t14 */
  nextDate: string
  /** Options having an expiration matching nearDate OR nextDate  */
  options: Array<OptionSummary>
  /** Keep a fixed underlying price */
  underlyingPrice: number
}

export type MfivIntermediates = {
  NT1: number
  NT2: number
  N14: number
  N365: number
  T1: number
  T2: number
  F1: number
  F2: number
  nearForwardStrike: number
  nextForwardStrike: number
  nearMid: MfivOptionSummary[]
  nextMid: MfivOptionSummary[]
  nearContribution: number
  nextContribution: number
  nearModSigmaSquared: number
  nextModSigmaSquared: number
  A: number
  B: number
  C: number
}

export type MfivResult = IndexResult & {
  intermediates?: MfivIntermediates
}
