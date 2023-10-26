/*import { DbLogoutAccount } from '../../../../data/usecases/account/logout-account/db-logout-account';
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository';
import { LogoutController } from '../../../../presentation/controllers/logout/logout-controller';
import { Controller } from '../../../../presentation/protocols/controller';
import { makeLogoutValidatorFactory } from './logout-validator-factory';

export const makeLogoutControllerFactory = (): Controller => {
  const validator = makeLogoutValidatorFactory()
  const accountLogoutRepository = new AccountMongoRepository()
  const dbAccountLogout = new DbLogoutAccount(accountLogoutRepository,accountLogoutRepository)
  return new LogoutController(validator)
}*/