"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.midOrMarkPrice = exports.optionSummaryToMfivOption = void 0;
const error_1 = require("../error");
const optionSummaryToMfivOption = (underlyingPrice) => (optionSummary) => {
    const { bestAskPrice, bestBidPrice, markPrice } = optionSummary;
    const midOrMark = (0, exports.midOrMarkPrice)({ bestAskPrice, bestBidPrice, markPrice });
    const { mfivPrice, midPrice, reason, source } = midOrMark;
    return {
        optionPrice: underlyingPrice * mfivPrice,
        mfivPrice,
        midPrice,
        reason,
        source,
        ...optionSummary
    };
};
exports.optionSummaryToMfivOption = optionSummaryToMfivOption;
/**
 * Compute the price of an option and
 *
 * @param obj An object with an interface able to calculate the mid of an option
 * @returns a value for either the mid, mark, or undefined
 *
 * @private
 */
const midOrMarkPrice = ({ bestAskPrice, bestBidPrice, markPrice }) => {
    const bid = bestBidPrice, ask = bestAskPrice, mark = markPrice;
    if (!bid || bid === 0) {
        throw (0, error_1.insufficientData)("bestBidPrice missing");
    }
    else if (!ask) {
        return { mfivPrice: markPrice, midPrice: undefined, reason: "bestAskPrice missing", source: "mark", markPrice };
    }
    else {
        const mid = (ask + bid) / 2;
        const result = mid >= 1.5 * mark
            ? { mfivPrice: markPrice, midPrice: mid, reason: "mid >= 1.5 * mark", source: "mark", markPrice }
            : { mfivPrice: mid, midPrice: mid, reason: "mid < 1.5 * mark", source: "mid", markPrice };
        return result;
    }
};
exports.midOrMarkPrice = midOrMarkPrice;
