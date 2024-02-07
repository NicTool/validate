const assert = require('node:assert/strict')

const schema = require('../lib/zone').zone
const testZone = require('./fixtures/zone.json')

describe('zone', function () {
  describe('zone', function () {
    it(`accepts valid`, () => {
      const testCase = JSON.parse(JSON.stringify(testZone))

      const { error, value } = schema.validate(testCase)

      assert.ifError(error)
      assert.deepStrictEqual(testCase, value)
    })

    it(`rejects empty`, () => {
      const testCase = JSON.parse(JSON.stringify(testZone))
      testCase.zone = ''

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"zone" is not allowed to be empty')
      assert.deepStrictEqual(testCase, value)
    })

    const invalid_chars = `~\`!@$%^&*()+=[]\\/|?><"':;,#{} \n`
      .split('')
      .map((a) => `thisis${a}atest.com.`)

    for (const char of invalid_chars) {
      it(`rejects invalid: ${char}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZone))
        testCase.zone = char

        const { error, value } = schema.validate(testCase)
        // if (error) console.error(error.message)

        assert.strictEqual(
          error.message,
          '"zone" must contain a valid domain name',
        )
        assert.deepStrictEqual(testCase, value)
      })
    }
  })

  describe('nt_group_id', function () {
    for (const gid of [1]) {
      it(`accepts valid: ${gid}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZone))
        testCase.nt_group_id = gid

        const { error, value } = schema.validate(testCase)

        assert.ifError(error)
        assert.deepStrictEqual(testCase, value)
      })
    }

    const errMsgs = [
      '"nt_group_id" must be a positive number',
      '"nt_group_id" must be a number',
    ]
    for (const gid of ['', 0, 'abc']) {
      it(`rejects invalid: ${gid}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZone))
        testCase.nt_group_id = gid

        const { error, value } = schema.validate(testCase)

        assert.ok(errMsgs.includes(error.message))
        assert.deepStrictEqual(testCase, value)
      })
    }
  })

  describe('ttl', function () {
    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testZone))
      delete testCase.ttl

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"ttl" is required')
      assert.deepStrictEqual(testCase, value)
    })
  })
})
