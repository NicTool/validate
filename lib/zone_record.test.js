const assert = require('node:assert/strict')
const { describe, it } = require('node:test')

const schema = require('./zone_record').v3
const testZR = require('./test/zone_record.json')

describe('zone_record', function () {
  describe('id', function () {
    it(`accepts valid`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      const { error, value } = schema.validate(testCase)
      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })

    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      delete testCase.id
      const { error, value } = schema.validate(testCase)
      assert.strictEqual(error.message, '"id" is required')
      assert.deepEqual(value, testCase)
    })

    it(`rejects empty`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      testCase.id = ''
      const { error, value } = schema.validate(testCase)
      assert.strictEqual(error.message, '"id" must be a number')
      assert.deepEqual(value, testCase)
    })

    const errMsgs = [
      '"id" must be a positive number',
      '"id" must be a number',
      '"id" must be greater than or equal to 1',
    ]

    for (const zid of ['abc', 0]) {
      it(`rejects invalid: ${zid}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZR))
        testCase.id = zid
        const { error, value } = schema.validate(testCase)
        assert.ok(errMsgs.includes(error.message))
        assert.deepEqual(value, testCase)
      })
    }
  })

  describe('owner', function () {
    it(`accepts valid`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      const { error, value } = schema.validate(testCase)
      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })

    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      delete testCase.owner
      const { error } = schema.validate(testCase)
      assert.strictEqual(error.message, '"owner" is required')
    })

    it(`rejects empty`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      testCase.owner = ''
      const { error } = schema.validate(testCase)
      assert.strictEqual(error.message, '"owner" is not allowed to be empty')
    })

    for (const owner of ['a.m.', 'something.test.']) {
      it(`rejects invalid: ${owner}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZR))
        testCase.owner = owner
        const { error } = schema.validate(testCase)
        assert.deepEqual(
          error.message,
          '"owner" must contain a valid domain name',
        )
      })
    }
  })

  describe('type', function () {
    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      delete testCase.type
      const { error } = schema.validate(testCase)
      assert.strictEqual(error.message, '"type" is required')
    })

    for (const type of ['A', 'AAAA', 'PTR']) {
      it(`accepts valid: ${type}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZR))
        testCase.type = type
        const { error, value } = schema.validate(testCase)
        assert.ifError(error)
        assert.deepEqual(value, testCase)
      })
    }

    for (const type of ['', 0, 'abc']) {
      it(`rejects invalid: ${type}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZR))
        testCase.type = type
        const { error } = schema.validate(testCase)
        assert.deepEqual(
          error.message,
          '"type" must be one of [A, AAAA, PTR, MX, NS, CNAME, SRV]',
        )
      })
    }
  })

  describe('ttl', function () {
    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      delete testCase.ttl

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"ttl" is required')
      assert.deepEqual(value, testCase)
    })
  })
})
