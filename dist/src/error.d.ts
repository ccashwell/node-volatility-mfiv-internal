import { Failure } from "./failure";
export declare enum VolatilityError {
    InsufficientData = "InsufficientData",
    UndefinedData = "UndefinedData",
    UnsupportedMethodology = "UndefinedMethodology",
    ParseError = "ParseError"
}
export declare const insufficientData: (reason: string) => Failure<VolatilityError.InsufficientData>;
export declare const undefinedDataError: () => Failure<VolatilityError.UndefinedData>;
export declare const unsupportedMethodology: (methodology: string) => Failure<VolatilityError.UnsupportedMethodology>;
export declare const parseError: (reason: string) => Failure<VolatilityError.ParseError>;
//# sourceMappingURL=error.d.ts.map