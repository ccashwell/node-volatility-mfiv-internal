import { Failure } from "./failure"

export enum VolatilityError {
  InsufficientData = "InsufficientData",
  UndefinedData = "UndefinedData",
  UnsupportedMethodology = "UndefinedMethodology",
  ParseError = "ParseError"
}

export const insufficientData = (reason: string): Failure<VolatilityError.InsufficientData> => ({
  type: VolatilityError.InsufficientData,
  reason: reason
})

export const undefinedDataError = (): Failure<VolatilityError.UndefinedData> => ({
  type: VolatilityError.UndefinedData,
  reason: "Unexpectedly encountered undefined data."
})

export const unsupportedMethodology = (methodology: string): Failure<VolatilityError.UnsupportedMethodology> => ({
  type: VolatilityError.UnsupportedMethodology,
  reason: `Unsupported methodology "${methodology}".`
})

export const parseError = (reason: string): Failure<VolatilityError.ParseError> => ({
  type: VolatilityError.ParseError,
  reason: reason
})
