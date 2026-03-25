import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import * as group from './group.js'
const schema = group.v3
const testGroup = require('./test/group.json')

describe('group', function () {
  describe('name', function () {
    it('accepts valid', () => {
      const { error, value } = schema.validate(testGroup)
      assert.ifError(error)
      assert.deepEqual(value, testGroup)
    })

    it('rejects missing name', () => {
      const testCase = JSON.parse(JSON.stringify(testGroup))
      delete testCase.name

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"name" is required')
      assert.deepEqual(value, testCase)
    })

    it('rejects too short', () => {
      const testCase = JSON.parse(JSON.stringify(testGroup))
      testCase.name = 'gr'

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"name" length must be at least 3 characters long')
      assert.deepEqual(value, testCase)
    })

    it('rejects too long', () => {
      const testCase = JSON.parse(JSON.stringify(testGroup))
      testCase.name =
        'abcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyz' +
        'abcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyz' +
        'abcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyz' +
        'abcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyz'

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(
        error.message,
        '"name" length must be less than or equal to 255 characters long',
      )
      assert.deepEqual(value, testCase)
    })

    for (const char of `~\`!$%^&*()+=[]\\/|?><":;,#{}\n`.split('')) {
      it(`rejects invalid character: ${char}`, () => {
        const testCase = JSON.parse(JSON.stringify(testGroup))
        testCase.name = `na${char}me`

        const { error, value } = schema.validate(testCase)

        assert.strictEqual(
          error.message,
          `"name" with value "na${char}me" fails to match the required pattern: /^[a-zA-Z0-9 _.@'-]+$/`,
        )
        assert.deepEqual(value, testCase)
      })
    }

    for (const t of ['-test', '_test', `'test`, '.test', '@test']) {
      it(`rejects if first character is not alphanumeric: ${t}`, () => {
        const testCase = JSON.parse(JSON.stringify(testGroup))
        testCase.name = t

        const { error, value } = schema.validate(testCase)

        assert.strictEqual(
          error.message,
          `"name" with value "${t}" fails to match the required pattern: /^[a-zA-Z0-9]/`,
        )
        assert.deepEqual(value, testCase)
      })
    }
  })
})
