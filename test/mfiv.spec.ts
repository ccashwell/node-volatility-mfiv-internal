import { expect } from "chai"
import { MfivEvidence } from "../src/types"
import { loadExample } from "../src/utils"
import { VolatilityCheck } from "../src/volatilitycheck"

function check(example: MfivEvidence) {
  const result = VolatilityCheck.check(example)

  expect(result.result).to.include({
    dVol: example.result.dVol,
    invdVol: example.result.invdVol,
    currency: example.context.currency,
    estimatedFor: example.params.at
  })

  expect(result.isSuccess).to.be.true
}

function validate(example: MfivEvidence) {
  expect(VolatilityCheck.isValid(example)).to.be.true
}

function invalidate(example: MfivEvidence) {
  expect(VolatilityCheck.isValid(example)).to.be.false
}

describe("MFIV", () => {
  describe("VolatilityCheck.check()", () => {
    context("with example 'eth-mfiv-14d-2021-10-01T07:02:00.000Z.json'", () => {
      const example = loadExample<MfivEvidence>("eth-mfiv-14d-2021-10-01T07:02:00.000Z.json")

      it("returns true for isValid", done => {
        check(example)
        done()
      })
    })
  })

  describe("VolatilityCheck.isValid()", () => {
    context("with example 'eth-mfiv-14d-2021-10-01T07:02:00.000Z.json'", () => {
      const example = loadExample<MfivEvidence>("eth-mfiv-14d-2021-10-01T07:02:00.000Z.json")

      it("returns true for isValid", done => {
        validate(example)
        done()
      })
    })

    context("with example 'eth-mfiv-14d-incorrect-result.json'", () => {
      const example = loadExample<MfivEvidence>("eth-mfiv-14d-incorrect-result.json")

      it("returns false for isValid", done => {
        invalidate(example)
        done()
      })
    })
  })
})
