import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import * as zoneRecordSchema from './zone_record.js'
const schema = zoneRecordSchema.v3
const postSchema = zoneRecordSchema.POST
const testZR = require('./test/zone_record.json')

describe('zone_record', function () {
  describe('id', function () {
    it(`accepts valid`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      const { error, value } = postSchema.validate(testCase)
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

    it('accepts underscores in labels', () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      testCase.owner = '_acme-challenge.example'
      const { error, value } = schema.validate(testCase)
      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })

    for (const owner of ['a.m.', 'something.test.']) {
      it.skip(`rejects invalid: ${owner}`, () => {
        const testCase = JSON.parse(JSON.stringify(testZR))
        testCase.owner = owner
        const { error } = schema.validate(testCase)
        assert.deepEqual(error.message, '"owner" must contain a valid domain name')
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
        assert.ok(/must be one of/.test(error.message))
      })
    }

    it('accepts HINFO with cpu and os', () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      testCase.type = 'HINFO'
      delete testCase.address
      testCase.cpu = 'Intel'
      testCase.os = 'Linux'

      const { error, value } = schema.validate(testCase)
      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })
  })

  describe('ttl', function () {
    it(`accepts missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testZR))
      delete testCase.ttl

      const { error, value } = postSchema.validate(testCase)

      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })
  })

  describe('rdata schema coverage', function () {
    const rrDir = path.resolve(__dirname, '../../dns-resource-record/rr')
    const hasRrDir = fs.existsSync(rrDir)

    ;(hasRrDir ? it : it.skip)('includes every RR getRdataFields key', () => {
      const rrFiles = fs.readdirSync(rrDir).filter((file) => file.endsWith('.js'))

      const rrFieldNames = new Set()
      const methodRegex = /getRdataFields\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}/g
      const stringRegex = /['"]([^'"]+)['"]/g

      for (const file of rrFiles) {
        const rrSource = fs.readFileSync(path.join(rrDir, file), 'utf8')
        let methodMatch

        while ((methodMatch = methodRegex.exec(rrSource)) !== null) {
          let stringMatch
          while ((stringMatch = stringRegex.exec(methodMatch[1])) !== null) {
            const field = stringMatch[1]
            if (/^[A-Za-z][A-Za-z0-9\-\s]*$/.test(field)) {
              rrFieldNames.add(field)
            }
          }
        }
      }

      const schemaKeys = Object.keys(zoneRecordSchema.v3.describe().keys)
      const missing = [...rrFieldNames].filter((field) => !schemaKeys.includes(field)).sort()

      assert.deepEqual(missing, [])
    })
  })
})
