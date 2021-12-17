import { MfivExample } from "./mfiv";
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
     * @public
     */
    isValid(example: MfivExample): boolean;
    private _isValid;
    private _compute;
}
//# sourceMappingURL=volatilitycheck.d.ts.map