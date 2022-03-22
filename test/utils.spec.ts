import { expect, use as chaiUse } from "chai"
import chaiAsPromised from "chai-as-promised"
import { describe, it } from "mocha"
import { MfivEvidence } from "../src/types"
import { loadExample, loadFile } from "../src/utils"

chaiUse(chaiAsPromised)

describe("loadFile()", () => {
  context("with path './example/eth-mfiv-14D-2021-10-01T07:02:00.000Z.json'", () => {
    it("returns an MfivExample object", done => {
      const example = loadFile<MfivEvidence>("./example/eth-mfiv-14D-2021-10-01T07:02:00.000Z.json")
      expect(example.context.methodology).to.eq("MFIV")
      done()
    })
  })
})

describe("loadExample()", () => {
  context("with example 'eth-mfiv-14D-2021-10-01T07:02:00.000Z'", () => {
    it("returns an MfivExample object", done => {
      const example = loadExample<MfivEvidence>("eth-mfiv-14D-2021-10-01T07:02:00.000Z")
      expect(example.context.methodology).to.eq("MFIV")
      done()
    })
  })
})
