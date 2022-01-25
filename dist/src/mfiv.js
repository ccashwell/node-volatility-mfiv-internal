"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compute = void 0;
/* eslint-disable @typescript-eslint/unbound-method */
const railway_1 = require("@nozzlegear/railway");
const debug_1 = require("./debug");
const mfivstep1_1 = require("./internal/mfivstep1");
const mfivstep2_1 = require("./internal/mfivstep2");
const mfivstep3_1 = require("./internal/mfivstep3");
/**
 * Compute the volatility index value for the given mfiv context and model parameters
 *
 * @param ctx Methodology context object
 * @param params Inputs for calculating the index
 * @returns a result object containing the index value and its intermediates
 */
function compute(context, params) {
    (0, debug_1.debug)("compute %s-%s-%s @ %s", context.methodology, context.currency, context.windowInterval, params.at);
    const step1 = new mfivstep1_1.MfivStep1();
    const step2 = new mfivstep2_1.MfivStep2();
    const step3 = new mfivstep3_1.MfivStep3();
    const input = { context, params };
    return (0, railway_1.pipe)(input)
        .chain(r => step1.run(r))
        .chain(r => step2.run({ ...input, expiries: r }))
        .chain(r => step3.run({ ...input, step2Terms: r }))
        .chain(r => produceResult({ ...input, ...r }))
        .value();
}
exports.compute = compute;
const produceResult = ({ context, params, intermediates, dVol, invdVol, value }) => {
    return {
        methodology: context.methodology,
        currency: context.currency,
        estimatedFor: params.at,
        dVol,
        invdVol,
        value,
        intermediates,
        metrics: []
    };
};
