for (const l of ['group', 'nameserver', 'permission', 'session', 'user', 'zone', 'zone_record']) {
  module.exports[l] = require(`./lib/${l}`)
}
