import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import * as nameserver from './nameserver.js'
const schema = nameserver.v3
const testNS = require('./test/nameserver.json')

describe('nameserver', function () {
  describe('name', function () {
    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      delete testCase.name

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"name" is required')
      assert.deepEqual(value, testCase)
    })

    for (const n of [
      'good-ns.tld.',
      'a.b.c.',
      'host.tld.',
      'host.name.',
      'valid-ns.sld.',
      'wooki.tld.',
    ]) {
      it(`accepts valid: ${n}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.name = n

        const { error, value } = schema.validate(testCase)

        assert.ifError(error)
        assert.deepEqual(value, testCase)
      })
    }

    const errMsgs = ['"name" must be a valid hostname', '"name" must contain a valid domain name']

    const invalid_names = [
      '-bad_ns',
      'bad.-domain',
      'host',
      'bad_ns',
      'über',
      'ns..somewhere.com.',
      'ns.-something.com.',
    ]
    const invalid_chars = `~\`!@$%^&*()_+=[]\\/|?><"':;,#{} \n`
      .split('')
      .map((a) => `a.b${a}d.com.`)

    for (const n of [...invalid_names, ...invalid_chars]) {
      it(`rejects invalid: ${n}`, function () {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.name = n

        const { error, value } = schema.validate(testCase)

        assert.ok(errMsgs.includes(error.message))
        assert.deepEqual(value, testCase)
      })
    }
  })

  describe('type', function () {
    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      delete testCase.type

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"type" is required')
      assert.deepEqual(value, testCase)
    })

    for (const n of [
      ...nameserver.BUILDABLE,
      ...Object.keys(nameserver.ALIASES),
      ...nameserver.UNBUILDABLE,
    ]) {
      it(`accepts valid: ${n}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.type = n

        const { error, value } = schema.validate(testCase)

        assert.ifError(error)
        assert.deepEqual(value, testCase)
      })
    }

    it('accepts coredns, which only v3 can build', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.type = 'coredns'

      assert.ifError(schema.validate(testCase).error)
    })

    // dynect has no v3 nameserver, but a 2.x install can hold one and the
    // record has to survive a round trip. The supervisor refuses to start it.
    it('accepts a 2.x type nothing here implements', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.type = 'dynect'

      assert.ifError(schema.validate(testCase).error)
    })

    // bind-nsupdate is BIND fed by RFC 2136 rather than by file copy, which is
    // a transport choice here, not a separate nameserver.
    it('resolves a 2.x alias to the type that implements it', () => {
      assert.equal(nameserver.resolveType('bind-nsupdate'), 'bind')
    })

    it('leaves a canonical type alone', () => {
      for (const t of nameserver.BUILDABLE) {
        assert.equal(nameserver.resolveType(t), t)
      }
    })

    it('does not claim an alias is buildable', () => {
      for (const alias of Object.keys(nameserver.ALIASES)) {
        assert.ok(!nameserver.BUILDABLE.includes(alias), alias)
        assert.ok(nameserver.BUILDABLE.includes(nameserver.resolveType(alias)), alias)
      }
    })

    for (const n of ['cryptic', 'fuzzy', 'yitizg', 'bin', 'djbs', 'DJB', 'BIND', 'NT']) {
      it(`rejects invalid: ${n}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.type = n

        const { error, value } = schema.validate(testCase)

        assert.match(error.message, /^"type" must be one of \[/)
        assert.deepEqual(value, testCase)
      })
    }
  })

  describe('listen', function () {
    it('accepts an array of {address, port, proto}', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.listen = [
        { address: '127.0.0.1', port: 53, proto: 'udp' },
        { address: '127.0.0.1', port: 53, proto: 'tcp' },
      ]
      const { error } = schema.validate(testCase)
      assert.ifError(error)
    })

    it('rejects an invalid proto', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.listen = [{ address: '127.0.0.1', port: 53, proto: 'http' }]
      const { error } = schema.validate(testCase)
      assert.match(error.message, /"listen\[0\]\.proto" must be one of/)
    })

    it('rejects out-of-range port', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.listen = [{ address: '127.0.0.1', port: 70000 }]
      const { error } = schema.validate(testCase)
      assert.match(error.message, /"listen\[0\]\.port"/)
    })
  })

  describe('publisher', function () {
    for (const t of ['memory', 'rfc1035', 'tinydns-cdb', 'powerdns-db']) {
      it(`accepts type=${t}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.publisher = { type: t }
        const { error } = schema.validate(testCase)
        assert.ifError(error)
      })
    }

    it('rejects unknown publisher type', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.publisher = { type: 'floppy' }
      const { error } = schema.validate(testCase)
      assert.match(error.message, /"publisher\.type" must be one of/)
    })
  })

  describe('transport', function () {
    for (const t of ['noop', 'axfr', 'rsync', 'db-replication']) {
      it(`accepts type=${t}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.transport = { type: t, interval: 0, cooldown: 2 }
        const { error } = schema.validate(testCase)
        assert.ifError(error)
      })
    }

    it('rejects unknown transport type', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.transport = { type: 'sneakernet' }
      const { error } = schema.validate(testCase)
      assert.match(error.message, /"transport\.type" must be one of/)
    })
  })

  describe('dnssec', function () {
    it('accepts a valid dnssec block', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.dnssec = {
        enabled: true,
        algorithm: 'ECDSAP256SHA256',
        keyset: './keys/ns1',
        nsec3: true,
      }
      const { error } = schema.validate(testCase)
      assert.ifError(error)
    })

    it('rejects an unknown algorithm', () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      testCase.dnssec = { enabled: true, algorithm: 'ROT13' }
      const { error } = schema.validate(testCase)
      assert.match(error.message, /"dnssec\.algorithm" must be one of/)
    })
  })

  describe('gid', function () {
    it(`accepts valid`, () => {
      const testCase = JSON.parse(JSON.stringify(testNS))

      const { error, value } = schema.validate(testCase)

      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })

    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      delete testCase.gid

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"gid" is required')
      assert.deepEqual(value, testCase)
    })

    for (const gid of [1]) {
      it(`accepts valid: ${gid}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.gid = gid

        const { error, value } = schema.validate(testCase)

        assert.ifError(error)
        assert.deepEqual(value, testCase)
      })
    }

    for (const gid of ['abc']) {
      it(`rejects invalid: ${gid}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.gid = gid

        const { error, value } = schema.validate(testCase)

        assert.strictEqual(error.message, '"gid" must be a number')
        assert.deepEqual(value, testCase)
      })
    }
  })

  describe('address', function () {
    it(`accepts valid`, () => {
      const testCase = JSON.parse(JSON.stringify(testNS))

      const { error, value } = schema.validate(testCase)

      assert.ifError(error)
      assert.deepEqual(value, testCase)
    })

    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      delete testCase.address

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"address" is required')
      assert.deepEqual(value, testCase)
    })

    for (const gid of ['1.2.3.4']) {
      it(`accepts valid: ${gid}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.address = gid

        const { error, value } = schema.validate(testCase)

        assert.ifError(error)
        assert.deepEqual(value, testCase)
      })
    }

    for (const addr of [
      '1.x.2.3',
      '.1.2.3',
      '1234.1.2.3',
      '256.2.3.4',
      '1.-.2.3',
      '1.2.3',
      '1.2',
      '1',
      '1.2.3.',
      '-1.2.3.4',
      '1. .3.4',
      '1.2,3.4',
      '1.,.3.4',
    ]) {
      it(`rejects invalid: ${addr}`, () => {
        const testCase = JSON.parse(JSON.stringify(testNS))
        testCase.address = addr

        const { error, value } = schema.validate(testCase)

        assert.strictEqual(
          error.message,
          '"address" must be a valid ip address of one of the following versions [ipv4] with a forbidden CIDR',
        )
        assert.deepEqual(value, testCase)
      })
    }
  })

  describe('ttl', function () {
    it(`rejects missing`, () => {
      const testCase = JSON.parse(JSON.stringify(testNS))
      delete testCase.ttl

      const { error, value } = schema.validate(testCase)

      assert.strictEqual(error.message, '"ttl" is required')
      assert.deepEqual(value, testCase)
    })
  })
})
