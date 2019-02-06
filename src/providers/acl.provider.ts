import Acl = require('acl');
import { User } from '../models'

const acl = new Acl(new Acl.memoryBackend());

acl.allow([
  {
    roles: [User.groups.TEMPORARY_USER],
    allows: [
      { resources: 'materials', permissions: 'read' },
      { resources: 'products', permissions: ['read_own', 'write_own'] }
    ]
  },
  {
    roles: [User.groups.OPERATOR],
    allows: [
      { resources: 'materials', permissions: '*' }
    ]
  }
])

module.exports = acl
