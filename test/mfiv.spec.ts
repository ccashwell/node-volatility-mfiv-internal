import { expect } from "chai"
import { describe, it } from "mocha"
import { MfivExample } from "../src/mfiv"
import { loadExample } from "../src/utils"
import { VolatilityCheck } from "../src/volatilitycheck"

function validate(example: MfivExample) {
  const volatilityCheck: VolatilityCheck = new VolatilityCheck()

  expect(volatilityCheck.isValid(example)).to.be.true
}

function invalidate(example: MfivExample) {
  const volatilityCheck: VolatilityCheck = new VolatilityCheck()

  expect(volatilityCheck.isValid(example)).to.be.false
}

describe("MFIV", () => {
  describe("VolatilityCheck", () => {
    context("with example 'eth-mfiv-14d-2021-10-01T07:02:00.000Z.json'", () => {
      const example = loadExample<MfivExample>("eth-mfiv-14d-2021-10-01T07:02:00.000Z.json")

      it("returns true for isValid", done => {
        validate(example)
        done()
      })
    })

    context("with example 'eth-mfiv-14d-incorrect-result.json'", () => {
      const example = loadExample<MfivExample>("eth-mfiv-14d-incorrect-result.json")

      it("returns false for isValid", done => {
        invalidate(example)
        done()
      })
    })
  })
})
