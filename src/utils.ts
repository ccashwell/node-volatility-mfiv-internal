import fs from "fs"
import https from "https"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

/**
 * Load IPFS json data
 * @param name of the example to load from the "./example" directory
 * @returns MfivExample
 */
export function loadExample<T>(name: string): T {
  if (!name.endsWith(".json")) {
    name += ".json"
  }

  return loadFile(`./example/${name}`)
}

/**
 * Load IPFS json data from a file
 * @param name of the example to load from the "./example" directory
 * @returns MfivExample
 */
export function loadFile<T>(path: string) {
  const data = fs.readFileSync(path, "utf-8"),
    record = JSON.parse(data, (key: string, value: unknown) => {
      const dateKeys = ["at", "expirationDate", "timestamp"]
      return dateKeys.includes(key) ? new Date(value as string) : value
    }) as T
  return record
}

/**
 * Load IPFS json data directly from IPFS given an IPFS hash
 * @param hash of the mfiv data to load
 * @returns MfivExample
 */
export async function loadIPFS<T>(hash: string): Promise<T> {
  const options = {
    hostname: "https://ipfs.io",
    port: 443,
    path: `/ipfs/${hash}`,
    method: "GET"
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, response => {
      const statusCode = response.statusCode as number

      if (statusCode < 200 || statusCode >= 300) {
        return reject(new Error(`HTTP status ${statusCode}`))
      }
      let body: Buffer[]

      response.on("data", chunk => {
        body.push(chunk as Buffer)
      })

      response.on("end", () => {
        try {
          const example = JSON.parse(Buffer.concat(body).toString()) as T
          resolve(example)
        } catch (e) {
          reject(e)
        }
      })
    })
    req.on("error", error => {
      reject(error)
    })
    req.end()
  })
}

export function asNumberOrUndefined(val: string | number | undefined | null) {
  if (val === undefined || val === null) {
    return
  }

  const asNumber = Number(val)

  if (isNaN(asNumber) || isFinite(asNumber) === false) {
    return
  }

  if (asNumber === 0) {
    return
  }

  return asNumber
}

export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
  fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1)
