import { AccessControl } from 'accesscontrol';
import { User } from '../models';
const ac = new AccessControl();

ac.grant(User.groups.TEMPORARY_USER)
  .createAny('product')
  .readOwn('product')
  .updateOwn('product', ['name', 'description', 'materialId', 'count'])
  .deleteOwn('product')

  .readOwn(User.modelName)
  .createOwn(User.modelName)
  .updateOwn(User.modelName, ['address'])
  .deleteOwn(User.modelName)

ac.grant(User.groups.USER)
  .extend(User.groups.TEMPORARY_USER)
  .createOwn('productApprove')//Может подтверждать заявку на печать

ac.grant(User.groups.ADMIN)
  .readAny(User.modelName)
  .createAny(User.modelName)
  .updateAny(User.modelName)
  .deleteAny(User.modelName)

ac.grant('guest');

ac.lock();

export default ac;
