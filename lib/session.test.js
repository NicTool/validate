import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import * as schema from './session.js'

describe('session', () => {
  describe('POST', function () {
    it('accepts valid', () => {
      const { error } = schema.POST.validate({
        username: 'valid',
        password: 'ab12CD#%alph',
      })
      assert.ifError(error)
    })

    it('accepts a qualified username longer than one stored username', () => {
      const { error } = schema.POST.validate({
        username: 'e2euser_nt2f07a89d99566e74_8@e2e_users_nt2f07a89d99566e74_1',
        password: 'ab12CD#%alph',
      })
      assert.ifError(error)
    })

    it('rejects an overlong unqualified username', () => {
      const { error } = schema.POST.validate({
        username: 'a'.repeat(51),
        password: 'ab12CD#%alph',
      })
      assert.ok(error)
    })

    it('validates both parts of a qualified username', () => {
      for (const username of ['@Valid Group', 'valid@x', 'valid@-invalid']) {
        const { error } = schema.POST.validate({ username, password: 'ab12CD#%alph' })
        assert.ok(error, username)
      }
    })

    it('rejects too long username', () => {
      const { error } = schema.POST.validate({
        username: `${'a'.repeat(50)}@${'b'.repeat(256)}`,
        password: 'ab12CD#%alph',
      })
      assert.ok(error)
    })

    it('rejects missing username', () => {
      const { error } = schema.POST.validate({
        password: 'ab12CD#%alph',
      })
      assert.strictEqual(error.message, '"username" is required')
    })

    it('rejects missing password', () => {
      const { error } = schema.POST.validate({
        username: 'valid',
      })
      assert.strictEqual(error.message, '"password" is required')
    })
  })

  describe('GET_res', () => {
    it('accepts effective permissions', () => {
      const { error } = schema.GET_res.validate({
        user: { id: 1, username: 'valid' },
        group: { id: 1, name: 'NicTool' },
        session: { id: 1 },
        permissions: {
          self_write: true,
          zone: { write: true, create: false },
        },
        meta: {},
      })
      assert.ifError(error)
    })
  })
})
