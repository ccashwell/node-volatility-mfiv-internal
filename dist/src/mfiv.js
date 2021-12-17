"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compute = void 0;
const tslib_1 = require("tslib");
const railway_1 = require("@nozzlegear/railway");
const dayjs_1 = (0, tslib_1.__importDefault)(require("dayjs"));
const duration_1 = (0, tslib_1.__importDefault)(require("dayjs/plugin/duration"));
const debug_1 = require("./debug");
const mfivstep1_1 = require("./internal/mfivstep1");
const mfivstep2_1 = require("./internal/mfivstep2");
const mfivstep3_1 = require("./internal/mfivstep3");
dayjs_1.default.extend(duration_1.default);
/**
 * Compute the volatility index value for the given mfiv context and model parameters
 *
 * @param ctx Methodology context object
 * @param params Inputs for calculating the index
 * @returns a result object containing the index value and its intermediates
 */
function compute(ctx, params) {
    (0, debug_1.debug)("compute %s-%s-%s @ %s", ctx.methodology, ctx.currency, ctx.windowInterval, params.at);
    const step1 = () => new mfivstep1_1.MfivStep1(params).run();
    const step2 = (expiries) => new mfivstep2_1.MfivStep2(ctx, params, expiries).run();
    const step3 = (intermediates) => new mfivstep3_1.MfivStep3(ctx, params, { intermediates: intermediates }).run();
    return (0, railway_1.pipe)(step1()).chain(step2).chain(step3).value();
}
exports.compute = compute;
