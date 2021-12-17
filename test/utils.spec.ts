import { expect, use as chaiUse } from "chai"
import chaiAsPromised from "chai-as-promised"
import { describe, it } from "mocha"
import { MfivExample } from "../src/mfiv"
import { loadExample, loadFile, loadIPFS } from "../src/utils"

chaiUse(chaiAsPromised)

describe("loadFile()", () => {
  context("with path './example/eth-mfiv-14d-2021-10-01T07:02:00.000Z.json'", () => {
    it("returns an MfivExample object", done => {
      const example = loadFile<MfivExample>("./example/eth-mfiv-14d-2021-10-01T07:02:00.000Z.json")
      expect(example.context.methodology).to.eq("mfiv")
      done()
    })
  })
})

describe("loadExample()", () => {
  context("with example 'eth-mfiv-14d-2021-10-01T07:02:00.000Z'", () => {
    it("returns an MfivExample object", done => {
      const example = loadExample<MfivExample>("eth-mfiv-14d-2021-10-01T07:02:00.000Z")
      expect(example.context.methodology).to.eq("mfiv")
      done()
    })
  })
})

describe.skip("loadIPFS()", () => {
  context("with IPFS hash 'bafybeiflgk3dzigdwwoq2cwove76332rv3mrj3tqwjh4g2pmcolptokhxa'", () => {
    it("returns an MfivExample object", async () => {
      await expect(loadIPFS("bafybeiflgk3dzigdwwoq2cwove76332rv3mrj3tqwjh4g2pmcolptokhxa")).to.eventually.be.fulfilled
    }).timeout(20000)
  })
})
