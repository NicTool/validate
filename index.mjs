import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const validate = require('./index.js')

export default validate

export const group = validate.group
export const nameserver = validate.nameserver
export const permission = validate.permission
export const session = validate.session
export const user = validate.user
export const zone = validate.zone
export const zone_record = validate.zone_record
