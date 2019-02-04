import { OnlineFdmCenterApplication } from '../..';
import { AuthToken } from '../../src/models'
import { AuthController } from '../../src/controllers';
import { UserRepository, AuthTokenRepository } from '../../src/repositories';
export async function getAuthToken(app: OnlineFdmCenterApplication): Promise<AuthToken> {
  let authTokenController = new AuthController(
    await app.getRepository<UserRepository>(UserRepository),
    await app.getRepository<AuthTokenRepository>(AuthTokenRepository)
  )
  return await authTokenController.temporaryRegister();
}

export async function removeAuthTokenAndUser(app: OnlineFdmCenterApplication, token: AuthToken): Promise<void> {
  let authTokenController = new AuthController(
    await app.getRepository<UserRepository>(UserRepository),
    await app.getRepository<AuthTokenRepository>(AuthTokenRepository)
  )
  return authTokenController.deleteUser(token.userId);
}
