"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfivStep1 = void 0;
const transducist_1 = require("transducist");
const debug_1 = require("../debug");
const error_1 = require("../error");
const optionpair_1 = require("../models/optionpair");
class MfivStep1 {
    run(input) {
        const { nearDate, nextDate, options, underlyingPrice } = input.params;
        const partitions = (0, transducist_1.chainFrom)(options)
            .map(ensureDefaults)
            .filter(validOption)
            .filter(isOneOf(nearDate, nextDate))
            .map(chooseMidOrMark)
            .map(convertTo(underlyingPrice))
            .toObjectGroupBy(o => o.expirationDate.toISOString());
        (0, debug_1.debug)("Options Partitioned");
        (0, debug_1.debug)("Partition keys %o", Object.keys(partitions));
        (0, debug_1.debug)("nearDate: %s : nextDate: %s : partitions.keys: %o : partitions[nearDate].length: %d, partitions[nextDate].length: %d", nearDate, nextDate, Object.keys(partitions), partitions[nearDate].length, partitions[nextDate].length);
        const nearBook = partitions[nearDate];
        const nextBook = partitions[nextDate];
        const nearOptionPairMap = (0, optionpair_1.toMapOfOptionPair)(nearBook);
        const nextOptionPairMap = (0, optionpair_1.toMapOfOptionPair)(nextBook);
        return {
            nearBook,
            nextBook,
            nearOptionPairMap,
            nextOptionPairMap
        };
    }
}
exports.MfivStep1 = MfivStep1;
const ensureDefaults = (o) => {
    return {
        ...o,
        bestAskPrice: o.bestAskPrice ?? 0,
        bestBidPrice: o.bestBidPrice ?? 0,
        markPrice: o.markPrice ?? 0,
        underlyingPrice: o.underlyingPrice ?? 0
    };
};
const validOption = (o) => o.bestBidPrice !== 0;
const isOneOf = (...isoDateStrings) => {
    const epochs = isoDateStrings.map(str => new Date(str)).map(date => date.valueOf());
    (0, debug_1.debug)("isOneOf %j", epochs);
    return (o) => epochs.includes(o.expirationDate.valueOf());
};
const chooseMidOrMark = (o) => {
    let midPrice = undefined;
    if (o.bestBidPrice === 0) {
        (0, debug_1.debug)("insufficient data due to bestBigPrice === 0");
        throw (0, error_1.insufficientData)("bestBidPrice missing");
    }
    else if (o.bestAskPrice === 0) {
        return {
            ...o,
            midPrice: o.markPrice,
            reason: "bestAskPrice missing",
            source: "mark"
        };
    }
    else {
        midPrice = (o.bestAskPrice + o.bestBidPrice) / 2;
        return midPrice >= 1.5 * o.markPrice
            ? {
                ...o,
                midPrice: o.markPrice,
                reason: "mid >= 1.5 * mark",
                source: "mark"
            }
            : {
                ...o,
                midPrice: midPrice,
                reason: "mid < 1.5 * mark",
                source: "mid"
            };
    }
};
const convertTo = (underlyingPrice) => (o) => {
    const optionPrice = o.midPrice * underlyingPrice;
    const converted = { ...o, optionPrice };
    return converted;
};
