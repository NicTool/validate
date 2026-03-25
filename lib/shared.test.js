import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import * as shared from './shared.js'

describe('shared', function () {
  describe('ttl', function () {
    it(`accepts valid`, () => {
      const { error } = shared.ttl.validate(0)
      assert.ifError(error)
    })

    it(`rejects missing`, () => {
      const { error } = shared.ttl.validate('')
      assert.strictEqual(error.message, '"value" must be a number')
    })

    for (const ttl of [0, 3600, 86401, 2147483647]) {
      it(`accepts valid: ${ttl}`, () => {
        const { error } = shared.ttl.validate(ttl)
        assert.ifError(error)
      })
    }

    const validErrs = [
      '"value" must be greater than -1',
      '"value" must be greater than or equal to 0',
      '"value" must be a number',
      '"value" must be less than or equal to 2147483647',
    ]

    for (const ttl of [-299, -2592001, -2, -1, 2147483648, 'oops']) {
      it(`rejects invalid: ${ttl}`, () => {
        const { error } = shared.ttl.validate(ttl)
        assert.ok(validErrs.includes(error.message))
      })
    }
  })
})
