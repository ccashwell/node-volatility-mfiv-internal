"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfivStep1 = void 0;
const railway_1 = require("@nozzlegear/railway");
const transducist_1 = require("transducist");
const mapper_1 = require("../models/mapper");
const optionpair_1 = require("../models/optionpair");
const utils_1 = require("../utils");
class MfivStep1 {
    constructor(params) {
        this.params = params;
    }
    run() {
        const underlyingPrice = this.params.underlyingPrice;
        const { nearDate, nextDate, options } = this.params;
        const partitions = (0, railway_1.pipe)(options).chain(partitionByNearAndNext(nearDate, nextDate, underlyingPrice)).value();
        const nearBook = partitions.nearBook;
        const nextBook = partitions.nextBook;
        const expiries = {
            nearBook: nearBook,
            nextBook: nextBook,
            nearOptionMap: toOptionsMap(partitions.nearBook),
            nextOptionMap: toOptionsMap(partitions.nextBook)
        };
        return expiries;
    }
}
exports.MfivStep1 = MfivStep1;
const isNearOrNext = (nearUnixDate, nextUnixDate) => {
    return (o) => {
        const expUnixMs = o.expirationDate.valueOf();
        return expUnixMs === nearUnixDate || expUnixMs === nextUnixDate;
    };
};
const hasValidBidPrice = (o) => {
    return (0, utils_1.asNumberOrUndefined)(o.bestBidPrice) !== undefined;
};
const isNearOrNextAndHasBidPrice = (nearUnixDate, nextUnixDate) => {
    const _isNearOrNext = isNearOrNext(nearUnixDate, nextUnixDate);
    return (o) => _isNearOrNext(o) && hasValidBidPrice(o);
};
const partitionByNearAndNext = (nearIsoDateString, nextIsoDateString, underlyingPrice) => (options) => {
    const nearDate = new Date(nearIsoDateString).valueOf();
    const nextDate = new Date(nextIsoDateString).valueOf();
    const partitions = (0, transducist_1.chainFrom)(options)
        .filter(isNearOrNextAndHasBidPrice(nearDate, nextDate))
        .map((0, mapper_1.optionSummaryToMfivOption)(underlyingPrice))
        .toObjectGroupBy(o => o.expirationDate.toISOString());
    return { nearBook: partitions[nearIsoDateString] ?? [], nextBook: partitions[nextIsoDateString] ?? [] };
};
const toOptionsMap = (options) => {
    return options.reduce((acc, current) => {
        const symbolRoot = current.symbol.slice(0, -2);
        const pair = acc.get(symbolRoot) ??
            new optionpair_1.OptionPair({
                symbol: current.symbol,
                strikePrice: current.strikePrice,
                expirationDate: current.expirationDate,
                callOption: undefined,
                putOption: undefined
            });
        if (current.optionType == "call") {
            pair.call = current;
        }
        else {
            pair.put = current;
        }
        return acc.set(symbolRoot, pair);
    }, new Map());
};
