# Validate

NicTool Object Validation

# Description

Validation class for objects in NicTool. Analgous to Nictool/../\*/Sanity in v2.

# Test

```
> npm test

  group
    name
      ✔ accepts valid
      ✔ rejects missing name
      ✔ rejects too short
      ✔ rejects too long
      ✔ rejects invalid character: ~
      ✔ rejects invalid character: `
      ✔ rejects invalid character: !
      ✔ rejects invalid character: $
      ✔ rejects invalid character: %
      ✔ rejects invalid character: ^
      ✔ rejects invalid character: &
      ✔ rejects invalid character: *
      ✔ rejects invalid character: (
      ✔ rejects invalid character: )
      ✔ rejects invalid character: +
      ✔ rejects invalid character: =
      ✔ rejects invalid character: [
      ✔ rejects invalid character: ]
      ✔ rejects invalid character: \
      ✔ rejects invalid character: /
      ✔ rejects invalid character: |
      ✔ rejects invalid character: ?
      ✔ rejects invalid character: >
      ✔ rejects invalid character: <
      ✔ rejects invalid character: "
      ✔ rejects invalid character: :
      ✔ rejects invalid character: ;
      ✔ rejects invalid character: ,
      ✔ rejects invalid character: #
      ✔ rejects invalid character: {
      ✔ rejects invalid character: }
      ✔ rejects invalid character:

      ✔ rejects if first character is not alphanumeric: -test
      ✔ rejects if first character is not alphanumeric: _test
      ✔ rejects if first character is not alphanumeric: 'test
      ✔ rejects if first character is not alphanumeric: .test
      ✔ rejects if first character is not alphanumeric: @test

  nameserver
    name
      ✔ rejects missing
      ✔ accepts valid: good-ns.tld.
      ✔ accepts valid: a.b.c.
      ✔ accepts valid: host.tld.
      ✔ accepts valid: host.name.
      ✔ accepts valid: valid-ns.sld.
      ✔ accepts valid: wooki.tld.
      ✔ rejects invalid: -bad_ns
      ✔ rejects invalid: bad.-domain
      ✔ rejects invalid: host
      ✔ rejects invalid: bad_ns
      ✔ rejects invalid: über
      ✔ rejects invalid: ns..somewhere.com.
      ✔ rejects invalid: ns.-something.com.
      ✔ rejects invalid: a.b~d.com.
      ✔ rejects invalid: a.b`d.com.
      ✔ rejects invalid: a.b!d.com.
      ✔ rejects invalid: a.b@d.com.
      ✔ rejects invalid: a.b$d.com.
      ✔ rejects invalid: a.b%d.com.
      ✔ rejects invalid: a.b^d.com.
      ✔ rejects invalid: a.b&d.com.
      ✔ rejects invalid: a.b*d.com.
      ✔ rejects invalid: a.b(d.com.
      ✔ rejects invalid: a.b)d.com.
      ✔ rejects invalid: a.b_d.com.
      ✔ rejects invalid: a.b+d.com.
      ✔ rejects invalid: a.b=d.com.
      ✔ rejects invalid: a.b[d.com.
      ✔ rejects invalid: a.b]d.com.
      ✔ rejects invalid: a.b\d.com.
      ✔ rejects invalid: a.b/d.com.
      ✔ rejects invalid: a.b|d.com.
      ✔ rejects invalid: a.b?d.com.
      ✔ rejects invalid: a.b>d.com.
      ✔ rejects invalid: a.b<d.com.
      ✔ rejects invalid: a.b"d.com.
      ✔ rejects invalid: a.b'd.com.
      ✔ rejects invalid: a.b:d.com.
      ✔ rejects invalid: a.b;d.com.
      ✔ rejects invalid: a.b,d.com.
      ✔ rejects invalid: a.b#d.com.
      ✔ rejects invalid: a.b{d.com.
      ✔ rejects invalid: a.b}d.com.
      ✔ rejects invalid: a.b d.com.
      ✔ rejects invalid: a.b
d.com.
    type
      ✔ rejects missing
      ✔ accepts valid: bind
      ✔ accepts valid: djbdns
      ✔ accepts valid: knot
      ✔ accepts valid: nsd
      ✔ accepts valid: maradns
      ✔ accepts valid: powerdns
      ✔ accepts valid: dynect
      ✔ rejects invalid: cryptic
      ✔ rejects invalid: fuzzy
      ✔ rejects invalid: yitizg
      ✔ rejects invalid: bin
      ✔ rejects invalid: djbs
      ✔ rejects invalid: DJB
      ✔ rejects invalid: BIND
      ✔ rejects invalid: NT
    nt_group_id
      ✔ accepts valid
      ✔ rejects missing
      ✔ accepts valid: 1
      ✔ rejects invalid: abc
    address
      ✔ accepts valid
      ✔ rejects missing
      ✔ accepts valid: 1.2.3.4
      ✔ rejects invalid: 1.x.2.3
      ✔ rejects invalid: .1.2.3
      ✔ rejects invalid: 1234.1.2.3
      ✔ rejects invalid: 256.2.3.4
      ✔ rejects invalid: 1.-.2.3
      ✔ rejects invalid: 1.2.3
      ✔ rejects invalid: 1.2
      ✔ rejects invalid: 1
      ✔ rejects invalid: 1.2.3.
      ✔ rejects invalid: -1.2.3.4
      ✔ rejects invalid: 1. .3.4
      ✔ rejects invalid: 1.2,3.4
      ✔ rejects invalid: 1.,.3.4
    ttl
      ✔ rejects missing

  shared
    ttl
      ✔ accepts valid
      ✔ rejects missing
      ✔ accepts valid: 0
      ✔ accepts valid: 3600
      ✔ accepts valid: 86401
      ✔ accepts valid: 2147483647
      ✔ rejects invalid: -299
      ✔ rejects invalid: -2592001
      ✔ rejects invalid: -2
      ✔ rejects invalid: -1
      ✔ rejects invalid: 2147483648
      ✔ rejects invalid: oops

  user
    username
      ✔ accepts valid
      ✔ rejects missing
      ✔ rejects too short
      ✔ rejects too long
      ✔ rejects invalid character: ~
      ✔ rejects invalid character: `
      ✔ rejects invalid character: !
      ✔ rejects invalid character: @
      ✔ rejects invalid character: $
      ✔ rejects invalid character: %
      ✔ rejects invalid character: ^
      ✔ rejects invalid character: &
      ✔ rejects invalid character: *
      ✔ rejects invalid character: (
      ✔ rejects invalid character: )
      ✔ rejects invalid character: +
      ✔ rejects invalid character: =
      ✔ rejects invalid character: [
      ✔ rejects invalid character: ]
      ✔ rejects invalid character: \
      ✔ rejects invalid character: /
      ✔ rejects invalid character: |
      ✔ rejects invalid character: ?
      ✔ rejects invalid character: >
      ✔ rejects invalid character: <
      ✔ rejects invalid character: "
      ✔ rejects invalid character: '
      ✔ rejects invalid character: :
      ✔ rejects invalid character: ;
      ✔ rejects invalid character: ,
      ✔ rejects invalid character: #
      ✔ rejects invalid character: {
      ✔ rejects invalid character: }
      ✔ rejects invalid character:

    email
      ✔ accepts valid
      ✔ rejects missing
      ✔ rejects invalid format
    password
      ✔ accepts a strong password
      ✔ rejects missing
      ✔ rejects too short password
      ✔ rejects most common password strings

  zone
    zone
      ✔ accepts valid
      ✔ rejects empty
      ✔ rejects invalid: thisis~atest.com.
      ✔ rejects invalid: thisis`atest.com.
      ✔ rejects invalid: thisis!atest.com.
      ✔ rejects invalid: thisis@atest.com.
      ✔ rejects invalid: thisis$atest.com.
      ✔ rejects invalid: thisis%atest.com.
      ✔ rejects invalid: thisis^atest.com.
      ✔ rejects invalid: thisis&atest.com.
      ✔ rejects invalid: thisis*atest.com.
      ✔ rejects invalid: thisis(atest.com.
      ✔ rejects invalid: thisis)atest.com.
      ✔ rejects invalid: thisis+atest.com.
      ✔ rejects invalid: thisis=atest.com.
      ✔ rejects invalid: thisis[atest.com.
      ✔ rejects invalid: thisis]atest.com.
      ✔ rejects invalid: thisis\atest.com.
      ✔ rejects invalid: thisis/atest.com.
      ✔ rejects invalid: thisis|atest.com.
      ✔ rejects invalid: thisis?atest.com.
      ✔ rejects invalid: thisis>atest.com.
      ✔ rejects invalid: thisis<atest.com.
      ✔ rejects invalid: thisis"atest.com.
      ✔ rejects invalid: thisis'atest.com.
      ✔ rejects invalid: thisis:atest.com.
      ✔ rejects invalid: thisis;atest.com.
      ✔ rejects invalid: thisis,atest.com.
      ✔ rejects invalid: thisis#atest.com.
      ✔ rejects invalid: thisis{atest.com.
      ✔ rejects invalid: thisis}atest.com.
      ✔ rejects invalid: thisis atest.com.
      ✔ rejects invalid: thisis
atest.com.
    nt_group_id
      ✔ accepts valid: 1
      ✔ rejects invalid:
      ✔ rejects invalid: 0
      ✔ rejects invalid: abc
    ttl
      ✔ rejects missing

  zone_record
    nt_zone_id
      ✔ accepts valid
      ✔ rejects missing
      ✔ rejects empty
      ✔ rejects invalid: abc
      ✔ rejects invalid: 0
    name
      ✔ accepts valid
      ✔ rejects missing
      ✔ rejects empty
      ✔ rejects invalid: a.m.
      ✔ rejects invalid: something.test.
    type
      ✔ rejects missing
      ✔ accepts valid: A
      ✔ accepts valid: AAAA
      ✔ accepts valid: PTR
      ✔ rejects invalid:
      ✔ rejects invalid: 0
      ✔ rejects invalid: abc
    ttl
      ✔ rejects missing


  229 passing (44ms)

```
