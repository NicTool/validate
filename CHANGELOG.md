# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/).

# CHANGES

### Unreleased

### [0.8.9] - 2026-03-29

- 


### [0.8.8] - 2026-03-25

- zone_rec: delete request has id in param

### [0.8.7] - 2026-03-25

- convert to ESM (#18)

### [0.8.5] - 2026-03-15

- zone.GET_req: add search params
- zone_rec.owner: disable domain/hostname validation
- zone_rec: add algorithm
- zone_rec: change gateway type to a number
- zone_rec: add timestamp

### [0.8.4] - 2026-03-14

- disable domain validation, until joi.string.domain supports /
  - related: hapijs/address#48

### [0.8.3] - 2026-03-13

- ns: NSD -> nsd
- user: user is now an array
- prettier: move config into package.json
- zone: last publish can be all zeroes
- zone_rec: expanded valid RR types & all the fields that go with them
- ESM: dual export with wrapper
- deps: bump all to latest

### [0.8.2] - 2025-04-08

- feat(zone_record): added GET, POST, and DELETE formats
- feat(zone): added GET, POST, and DELETE formats
- feat(session): can return a token
- feat(perm): name ca be empty
- feat(ns): GET always returns an array of items
- feat(ns): address6 can be empty
- meta: add [files] to package.json, deleted .npmignore

### [0.8.1] - 2024-12-16

- doc(CONTRIBUTORS): added
- dep(eslint): bump to 9.17.0
- dep(joi): bump to 17.3.3

### [0.8.0] - 2024-03-06

- feat(nameserver): added GET_req, GET_res, POST, DELETE
- feat(group,permission,session,user): separate GET_req, GET_res
- feat(group,user): added DELETE
- feat(shared): added int8, uint8, int16, uint16, int32

### [0.7.4] - 2024-03-04

- feat(permission): added POST, GET, DELETE
- feat(group.GET): allows deleted property
- feat(session): exports id
- change(user): remove permission object

### [0.7.3] - 2024-02-28

- feat: permission updates
- feat: add shared.int32 and shared.uint32
- feat: improvements to zone and zone_record formats

### [0.7.2] - 2024-02-27

- group: GET returns parent_gid

### [0.7.1] - 2024-02-24

- group: parent_id can be zero

### [0.7.0] - 2024-02-24

- session: split to separate file
- user: sessionPost -> session.POST
- test: switch file names to \*.test.js
- group: added GET & POST
- shared: added meta

### [0.6.3] - 2024-02-23

- replace mocha with node's test runner
- user: permit @ character in username
- feat(user): export login, username, & password
- feat(zone_record): add zone_record validation
- feat(zone): added zone validation
- refactor: lib/common -> lib/shared
- feat(nameserver): added NS validation
- feat: import user & group tests from v2
- add group & permission

[0.1.0]: https://github.com/NicTool/validate/releases/tag/0.1.0
[0.1.1]: https://github.com/NicTool/validate/releases/tag/0.1.1
[0.3.0]: https://github.com/NicTool/validate/releases/tag/0.3.0
[0.4.0]: https://github.com/NicTool/validate/releases/tag/0.4.0
[0.5.0]: https://github.com/NicTool/validate/releases/tag/0.5.0
[0.6.0]: https://github.com/NicTool/validate/releases/tag/0.6.0
[0.6.1]: https://github.com/NicTool/validate/releases/tag/0.6.1
[0.6.3]: https://github.com/NicTool/validate/releases/tag/0.6.3
[0.7.0]: https://github.com/NicTool/validate/releases/tag/0.7.0
[0.7.1]: https://github.com/NicTool/validate/releases/tag/v0.7.1
[0.7.2]: https://github.com/NicTool/validate/releases/tag/v0.7.2
[0.7.3]: https://github.com/NicTool/validate/releases/tag/0.7.3
[0.7.4]: https://github.com/NicTool/validate/releases/tag/v0.7.4
[0.8.0]: https://github.com/NicTool/validate/releases/tag/v0.8.0
[0.8.1]: https://github.com/NicTool/validate/releases/tag/v0.8.1
[0.8.2]: https://github.com/NicTool/validate/releases/tag/v0.8.2
[0.8.3]: https://github.com/NicTool/validate/releases/tag/v0.8.3
[0.8.4]: https://github.com/NicTool/validate/releases/tag/v0.8.4
[0.8.5]: https://github.com/NicTool/validate/releases/tag/v0.8.5
[0.8.7]: https://github.com/NicTool/validate/releases/tag/v0.8.7
[0.8.8]: https://github.com/NicTool/validate/releases/tag/v0.8.8
[0.8.9]: https://github.com/NicTool/validate/releases/tag/v0.8.9
