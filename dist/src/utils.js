"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = exports.asNumberOrUndefined = exports.loadIPFS = exports.loadFile = exports.loadExample = void 0;
const tslib_1 = require("tslib");
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const https_1 = (0, tslib_1.__importDefault)(require("https"));
const dayjs_1 = (0, tslib_1.__importDefault)(require("dayjs"));
const utc_1 = (0, tslib_1.__importDefault)(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
/**
 * Load IPFS json data
 * @param name of the example to load from the "./example" directory
 * @returns MfivExample
 */
function loadExample(name) {
    if (!name.endsWith(".json")) {
        name += ".json";
    }
    return loadFile(`./example/${name}`);
}
exports.loadExample = loadExample;
/**
 * Load IPFS json data from a file
 * @param name of the example to load from the "./example" directory
 * @returns MfivExample
 */
function loadFile(path) {
    const data = fs_1.default.readFileSync(path, "utf-8"), record = JSON.parse(data, (key, value) => {
        const dateKeys = ["at", "expirationDate", "timestamp"];
        return dateKeys.includes(key) ? new Date(value) : value;
    });
    return record;
}
exports.loadFile = loadFile;
/**
 * Load IPFS json data directly from IPFS given an IPFS hash
 * @param hash of the mfiv data to load
 * @returns MfivExample
 */
async function loadIPFS(hash) {
    const options = {
        hostname: "https://ipfs.io",
        port: 443,
        path: `/ipfs/${hash}`,
        method: "GET"
    };
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, response => {
            const statusCode = response.statusCode;
            if (statusCode < 200 || statusCode >= 300) {
                return reject(new Error(`HTTP status ${statusCode}`));
            }
            let body;
            response.on("data", chunk => {
                body.push(chunk);
            });
            response.on("end", () => {
                try {
                    const example = JSON.parse(Buffer.concat(body).toString());
                    resolve(example);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
        req.on("error", error => {
            reject(error);
        });
        req.end();
    });
}
exports.loadIPFS = loadIPFS;
function asNumberOrUndefined(val) {
    if (val === undefined || val === null) {
        return;
    }
    const asNumber = Number(val);
    if (isNaN(asNumber) || isFinite(asNumber) === false) {
        return;
    }
    if (asNumber === 0) {
        return;
    }
    return asNumber;
}
exports.asNumberOrUndefined = asNumberOrUndefined;
const compose = (fn1, ...fns) => fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);
exports.compose = compose;
