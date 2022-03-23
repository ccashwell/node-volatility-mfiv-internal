import { MfivContext, MfivParams } from "../mfiv"
import { OptionPair } from "../models/optionpair"

export const VERSIONS = ["2022-01-01"] as const

export const CURRENCIES = ["ETH"] as const

export const EXCHANGES = ["deribit"] as const

export const METHODOLOGIES = ["MFIV"] as const

export const MFIV_DURATIONS = ["14D"] as const

export const EVIDENCES = ["mfiv.estimate.evidence"] as const

export type Version = typeof VERSIONS[number]

export type Currency = typeof CURRENCIES[number]

export type Exchange = typeof EXCHANGES[number]

export type Methodology = typeof METHODOLOGIES[number]

export type Evidence = typeof EVIDENCES[number]

export type MfivDuration = typeof MFIV_DURATIONS[number]

/**
 * Data type to represent the number of milliseconds since January 1, 1970
 */
export type UnixEpochType = number

/**
 * A Date value serialized as an iso8601 timestamp
 */
export type IsoDateString = string

/**
 * Emitted data points expressed as metrics
 */
export interface Metric {
  readonly type: string
  readonly value: string
  readonly timestamp: UnixEpochType
}

export type Metadata = unknown

export type MethodologyEvidence<
  V extends Version,
  E extends Evidence,
  M extends Metadata,
  C extends Context,
  P extends Params,
  R extends Result
> = {
  version: V
  type: E
  metadata?: M
  context: C
  params: P
  result: R
}

// export type Example = MfivExample
export interface OptionPrice {
  readonly optionPrice: number
}

export type OptionSummaryInput = {
  readonly symbol: string
  readonly timestamp: Date
  readonly optionType: "put" | "call"
  readonly expirationDate: Date
  readonly strikePrice: number
  readonly bestBidPrice: number | undefined
  readonly bestAskPrice: number | undefined
  readonly markPrice: number | undefined
  readonly underlyingPrice: number | undefined
}

export type OptionSummary = {
  readonly symbol: string
  readonly timestamp: Date
  readonly optionType: "put" | "call"
  readonly expirationDate: Date
  readonly strikePrice: number
  readonly bestBidPrice: number
  readonly bestAskPrice: number
  readonly markPrice: number
  readonly underlyingPrice: number
}

export type BaseContext = {
  readonly methodology: Methodology
  readonly exchange: Exchange
  readonly currency: Currency
}

export type OptionType = { optionType: "call" | "put" }

export type Context = MfivContext

export type Params = MfivParams

export type Result = MfivResult

export type OptionPairMap<T extends OptionPrice & OptionSummary> = Map<string, OptionPair<T>>

export interface Expiries<T extends OptionSummary & OptionPrice> {
  nearOptionPairMap: OptionPairMap<T>
  nextOptionPairMap: OptionPairMap<T>
  nearBook: T[]
  nextBook: T[]
}

export type MfivOptionSummary = OptionSummary &
  OptionPrice & {
    midPrice?: number
    markPrice: number
    source: "mid" | "mark"
    reason: "mid >= 1.5 * mark" | "bestAskPrice missing" | "mid < 1.5 * mark"
  }

export interface MfivEstimate {
  /** The value calculated - otherwise, undefined */
  readonly value: number | undefined
  /** Any intermediate terms generated in the calculation of mfiv */
  readonly intermediates?: MfivIntermediates
}

export interface MfivResultWithInverse {
  readonly dVol: number | undefined
  readonly invdVol: number | undefined
}

export interface MfivStep2Terms {
  finalNearBook: [string, MfivOptionSummary][]
  finalNextBook: [string, MfivOptionSummary][]
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
  nearContribution: number
  nextContribution: number
  nearModSigmaSquared: number
  nextModSigmaSquared: number
}

export type MfivIntermediates = MfivStep2Terms & {
  A: number
  B: number
  C: number
}

export type MfivResult = MfivEstimate &
  MfivResultWithInverse & {
    readonly methodology: "mfiv"
    readonly currency: Currency
    /** The time used (also expressed as 'ct' in the whitepaper) for the estimation */
    readonly estimatedFor: IsoDateString

    readonly metrics?: Metric[]
  }

export type MfivEvidence = MethodologyEvidence<
  "2022-01-01",
  "mfiv.estimate.evidence",
  unknown,
  MfivContext,
  MfivParams,
  MfivResult
>
