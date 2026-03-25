import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import * as zone from './zone.js'
const schema = zone.v3
const testZone = require('./test/zone.json')

describe('zone', function () {
  describe('zone', function () {
    it(`accepts valid`, () => {
      const testCase = JSON.parse(JSON.stringify(testZone))

      const { error, value } = schema.validate(testCase)

      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })

    it(`rejects empty`, () => {
      const testCase = JSON.parse(JSON.stringify(testZone))
      testCase.zone = ''

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"zone" is not allowed to be empty')
      assert.deepEqual(value, testCase)
    })

    const invalid_chars = `~\`!@$%^&*()+=[]\\/|?><"':;,#{} \n`
      .split('')
      .map((a) => `thisis${a}atest.com.`)

    for (const char of invalid_chars) {
      it.skip(`rejects invalid: ${char}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZone))
        testCase.zone = char

        const { error, value } = schema.validate(testCase)
        // if (error) console.error(error.message)

        assert.strictEqual(error?.message, '"zone" must contain a valid domain name')
        assert.deepEqual(value, testCase)
      })
    }
  })

  describe('nt_group_id', function () {
    for (const gid of [1]) {
      it(`accepts valid: ${gid}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZone))
        testCase.gid = gid

        const { error, value } = schema.validate(testCase)

        assert.ifError(error)
        assert.deepEqual(value, testCase)
      })
    }

    const errMsgs = [
      '"gid" must be a positive number',
      '"gid" must be a number',
      '"gid" must be greater than or equal to 0',
    ]
    for (const gid of ['', -1, 'abc']) {
      it(`rejects invalid: ${gid}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZone))
        testCase.gid = gid

        const { error, value } = schema.validate(testCase)
        assert.ok(errMsgs.includes(error.message))
        assert.deepEqual(value, testCase)
      })
    }
  })

  describe('ttl', function () {
    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testZone))
      delete testCase.ttl

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"ttl" is required')
      assert.deepEqual(value, testCase)
    })
  })
})
