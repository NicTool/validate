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
})
