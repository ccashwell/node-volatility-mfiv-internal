/* eslint-disable @typescript-eslint/unbound-method */
import { pipe } from "@nozzlegear/railway"
import { debug } from "./debug"
import { MfivStep1, MfivStepInput } from "./internal/mfivstep1"
import { MfivStep2 } from "./internal/mfivstep2"
import { MfivStep3 } from "./internal/mfivstep3"
import { BaseContext, MfivDuration, MfivEstimate, MfivResult, MfivResultWithInverse, OptionSummary } from "./types"

/**
 * Compute the volatility index value for the given mfiv context and model parameters
 *
 * @param ctx Methodology context object
 * @param params Inputs for calculating the index
 * @returns a result object containing the index value and its intermediates
 */
export function compute(context: MfivContext, params: MfivParams): MfivResult {
  debug("compute %s-%s-%s @ %s", context.methodology, context.asset, context.timePeriod, params.at)
  const step1 = new MfivStep1()
  const step2 = new MfivStep2()
  const step3 = new MfivStep3()
  const input = { context, params }

  return pipe(input)
    .chain(r => step1.run(r))
    .chain(r => step2.run({ ...input, expiries: r }))
    .chain(r => step3.run({ ...input, step2Terms: r }))
    .chain(r => produceResult({ ...input, ...r }))
    .value()
}

const produceResult = ({
  context,
  params,
  intermediates,
  dVol,
  invdVol,
  value
}: MfivStepInput & MfivResultWithInverse & MfivEstimate): MfivResult => {
  const { methodology, asset } = context
  return {
    methodology,
    asset,
    estimatedFor: params.at,
    dVol,
    invdVol,
    value,
    intermediates,
    metrics: []
  }
}

export type MfivContext = BaseContext & {
  readonly timePeriod: MfivDuration
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
  /** Use a fixed underlying price */
  underlyingPrice: number
}
