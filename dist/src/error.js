"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseError = exports.unsupportedMethodology = exports.undefinedDataError = exports.insufficientData = exports.VolatilityError = void 0;
var VolatilityError;
(function (VolatilityError) {
    VolatilityError["InsufficientData"] = "InsufficientData";
    VolatilityError["UndefinedData"] = "UndefinedData";
    VolatilityError["UnsupportedMethodology"] = "UndefinedMethodology";
    VolatilityError["ParseError"] = "ParseError";
})(VolatilityError = exports.VolatilityError || (exports.VolatilityError = {}));
const insufficientData = (reason) => ({
    type: VolatilityError.InsufficientData,
    reason: reason
});
exports.insufficientData = insufficientData;
const undefinedDataError = () => ({
    type: VolatilityError.UndefinedData,
    reason: "Unexpectedly encountered undefined data."
});
exports.undefinedDataError = undefinedDataError;
const unsupportedMethodology = (methodology) => ({
    type: VolatilityError.UnsupportedMethodology,
    reason: `Unsupported methodology "${methodology}".`
});
exports.unsupportedMethodology = unsupportedMethodology;
const parseError = (reason) => ({
    type: VolatilityError.ParseError,
    reason: reason
});
exports.parseError = parseError;
