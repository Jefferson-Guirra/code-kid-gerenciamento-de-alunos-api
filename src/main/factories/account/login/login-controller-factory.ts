import { DbAuthentication } from '../../../../data/usecases/account/authentication/db-authentication';
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository';
import { LoginController } from '../../../../presentation/controllers/login/login-controller';
import { Controller } from '../../../../presentation/protocols/controller';
import env from '../../../config/env';
import { makeLoginValidatorFactory } from './login-validator-factory';

const salt = 12
export const makeLoginControllerFactory = (): Controller => {
  const validator = makeLoginValidatorFactory()
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter)
  return new LoginController(validator, dbAuthentication)
}