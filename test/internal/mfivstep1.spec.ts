import { expect } from "chai"
import { describe, it } from "mocha"
import { MfivStep1 } from "../../src/internal/mfivstep1"
import { MfivEvidence } from "../../src/types"
import { loadExample } from "../../src/utils"

describe("class MfivStep1", () => {
  describe("run()", () => {
    context("with example 'eth-mfiv-14d-2021-10-01T07:02:00.000Z.json'", () => {
      const example = loadExample<MfivEvidence>("eth-mfiv-14d-2021-10-01T07:02:00.000Z.json")

      it("partitions options into near and next options", done => {
        const step = new MfivStep1()
        const result = step.run(example)

        expect(result.nearBook).to.not.be.empty
        expect(result.nextBook).to.not.be.empty
        expect(result.nearOptionPairMap).to.not.be.empty
        expect(result.nextOptionPairMap).to.not.be.empty

        done()
      })
    })
  })
})
