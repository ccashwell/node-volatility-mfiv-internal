import { EXCHANGES, METHODOLOGIES, VERSIONS, CURRENCIES } from "./constants"
import { MfivContext, MfivParams, MfivResult, MfivExample } from "./mfiv"
import { OptionPair } from "./models/optionpair"

export type Version = typeof VERSIONS[number]

export type Currency = typeof CURRENCIES[number]

export type Exchange = typeof EXCHANGES[number]

export type Methodology = typeof METHODOLOGIES[number]

export type MethodologyExample<V extends Version, C extends Context, P extends Params, R extends Result> = {
  version: V
  context: C
  params: P
  result: R
}

export type Example = MfivExample

export type OptionSummary = {
  readonly symbol: string
  readonly timestamp: Date
  readonly optionType: "put" | "call"
  readonly expirationDate: Date
  readonly strikePrice: number
  readonly bestBidPrice: number | undefined
  readonly bestAskPrice: number | undefined
  readonly markPrice: number
  readonly underlyingPrice: number
}

export type BaseContext = {
  readonly methodology: Methodology
  readonly exchange: Exchange
  readonly currency: Currency
}

export type IndexResult = {
  dVol: number | undefined
  invdVol: number | undefined
}

export type Context = MfivContext

export type Params = MfivParams

export type Result = MfivResult

export type OptionPairMap = Map<string, OptionPair>

export type MidOrMarkType = {
  mfivPrice: number
  midPrice?: number
  markPrice: number
  source: "mid" | "mark"
  reason: "mid >= 1.5 * mark" | "bestAskPrice missing" | "mid < 1.5 * mark"
}

export type MfivOptionSummary = Required<Pick<OptionSummary, "underlyingPrice" | "bestAskPrice" | "bestBidPrice">> &
  MidOrMarkType & { underlyingPrice: number } & Omit<
    OptionSummary,
    "underlyingPrice" | "bestAskPrice" | "bestBidPrice"
  > & { price: number }
