import { AccessControl } from 'accesscontrol';
import { User, Product, Materials, ThreeDFile, PrintQuality } from '../models';
const ac = new AccessControl();

ac.grant(User.groups.TEMPORARY_USER)
  .createOwn(Product.modelName)
  .readOwn(Product.modelName)
  .updateOwn(Product.modelName, ['name', 'description', 'materialId', 'count'])
  .deleteOwn(Product.modelName)

  .createOwn(User.modelName)
  .readOwn(User.modelName)
  .updateOwn(User.modelName, ['mail', 'address', 'password'])
  .deleteOwn(User.modelName)

  .createAny(ThreeDFile.modelName)
  .readAny(ThreeDFile.modelName)

  .readAny(Materials.modelName)

  .readAny(PrintQuality.modelName)

ac.grant(User.groups.USER)
  .extend(User.groups.TEMPORARY_USER)
  .createOwn('productApprove')//Может подтверждать заявку на печать

ac.grant(User.groups.OPERATOR)
  .extend(User.groups.USER)
  .createAny(Product.modelName)
  .readAny(Product.modelName)
  .updateAny(Product.modelName)
  .deleteAny(Product.modelName)

  .updateAny(ThreeDFile.modelName)
  .deleteAny(ThreeDFile.modelName)

  .createAny(Materials.modelName)
  .updateAny(Materials.modelName)
  .deleteAny(Materials.modelName)

  .createAny(PrintQuality.modelName)
  .readAny(PrintQuality.modelName)
  .updateAny(PrintQuality.modelName)
  .deleteAny(PrintQuality.modelName)

ac.grant(User.groups.ADMIN)
  .extend(User.groups.OPERATOR)
  .createAny(User.modelName)
  .readAny(User.modelName)
  .updateAny(User.modelName)
  .deleteAny(User.modelName)

ac.grant(User.groups.SERVER)
  .readAny(ThreeDFile.modelName)
  .updateAny(ThreeDFile.modelName)

ac.grant('guest');

ac.lock();

export default ac;
