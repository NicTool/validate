import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import * as schema from './user.js'

const userV2 = require('../test/fixtures/v2/user.json')
const userV3 = require('./test/user.json')

describe('user', function () {
  describe('v2', function () {
    it('accepts valid', () => {
      const testCase = JSON.parse(JSON.stringify(userV2))
      const { error, value } = schema.v2.validate(testCase)
      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })
  })

  describe('v3', function () {
    it('accepts valid', () => {
      const testCase = JSON.parse(JSON.stringify(userV3))
      const { error, value } = schema.v3.validate(testCase)
      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })
  })

  describe('username', () => {
    it('rejects empty', () => {
      const { error } = schema.username.validate('')
      assert.ok(/not allowed to be empty/.test(error.message))
    })

    it('rejects too short', () => {
      const { error, value } = schema.username.validate('u')
      assert.ok(/length must be at least 3 characters long/.test(error.message))
      assert.deepEqual(value, 'u')
    })

    it('rejects too long', () => {
      const username = 'abcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyzabcdefghijklmopqrstuvwxyz'

      const { error, value } = schema.username.validate(username)

      assert.ok(/length must be less than or equal to 50 characters long/.test(error.message))
      assert.deepEqual(value, username)
    })

    for (const char of `~\`!$%^&*()+=[]\\/|?><"':;,#{}\n`.split('')) {
      it(`rejects invalid character: ${char}`, () => {
        const username = `user${char}name`
        const { error, value } = schema.username.validate(username)
        assert.ok(/fails to match the required pattern/.test(error.message))
        assert.deepEqual(value, username)
      })
    }
  })

  describe('email', function () {
    it('accepts valid', () => {
      const email = 'user@test.com'
      const { error, value } = schema.email.validate(email)
      assert.ifError(error)
      assert.equal(value, email)
    })

    it('rejects empty', () => {
      const { error } = schema.email.validate('')
      assert.ok(error)
    })

    it('rejects invalid format', () => {
      const email = 'user'
      const { error, value } = schema.email.validate(email)
      assert.ok(/must be a valid email/.test(error.message))
      assert.deepEqual(value, email)
    })
  })

  describe('password', function () {
    it('accepts a strong password', () => {
      const password = 'This 1 Is Very 3#$@!in Good'
      const { error, value } = schema.password.validate(password)
      assert.ifError(error)
      assert.deepEqual(value, password)
    })

    it('rejects too short password', () => {
      const password = 'ab12!@'
      const { error, value } = schema.password.validate(password)
      assert.ok(/length must be at least 8 characters/.test(error.message))
      assert.deepEqual(value, password)
    })

    it('rejects most common password strings', () => {
      const password = 'bigLongpasswordWithabc12!@'
      const { error, value } = schema.password.validate(password)
      assert.ok(/should not contain any of the following/.test(error.message))
      assert.deepEqual(value, password)
    })
  })
})
