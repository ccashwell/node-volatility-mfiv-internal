import { MfivEvidence, MfivResult } from "./types";
export declare class VolatilityCheck {
    /**
     * Returns whether or not the given mfiv inputs match an expected result by
     * comparing the output of the computed index value to `example.result`
     *
     * @param example - The mfiv data that produced `example.result`
     * @returns A boolean indicating whether `example.result` matches the index
     *          value computed given `example.params`
     *
     * @throws unsupportedMethodology
     * This exception is thrown when the example contains an unsupported methodology.
     *
     */
    static isValid(example: MfivEvidence): boolean;
    static check(example: MfivEvidence): {
        isSuccess: boolean;
        result: MfivResult;
    };
    private static _compute;
}
//# sourceMappingURL=volatilitycheck.d.ts.map