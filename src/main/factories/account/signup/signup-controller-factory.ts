
import { DbAddAccountRepository } from '../../../../data/usecases/account/add-account/db-add-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/account/account-mongo-repository'
import { SecurityKeysMongoRepository } from '../../../../infra/db/security-keys/security-keys-mongo-repository'
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeSignupValidator } from './signup-validator-factory'

const salt = 12
export const makeSignupController = (): Controller => {
  const validator = makeSignupValidator()
  const accountMongoRepository = new AccountMongoRepository()
  const bcrypterAdapter = new BcryptAdapter(salt)
  const keysMongoRepository = new SecurityKeysMongoRepository(bcrypterAdapter)
  const dbAddAccount = new DbAddAccountRepository(
    accountMongoRepository, 
    keysMongoRepository, 
    accountMongoRepository,
    bcrypterAdapter)
  return new SignUpController(validator, dbAddAccount)
}