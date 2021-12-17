/**
 * Load IPFS json data
 * @param name of the example to load from the "./example" directory
 * @returns MfivExample
 */
export declare function loadExample<T>(name: string): T;
/**
 * Load IPFS json data from a file
 * @param name of the example to load from the "./example" directory
 * @returns MfivExample
 */
export declare function loadFile<T>(path: string): T;
/**
 * Load IPFS json data directly from IPFS given an IPFS hash
 * @param hash of the mfiv data to load
 * @returns MfivExample
 */
export declare function loadIPFS<T>(hash: string): Promise<T>;
export declare function asNumberOrUndefined(val: string | number | undefined | null): number | undefined;
export declare const compose: <R>(fn1: (a: R) => R, ...fns: ((a: R) => R)[]) => (a: R) => R;
//# sourceMappingURL=utils.d.ts.map