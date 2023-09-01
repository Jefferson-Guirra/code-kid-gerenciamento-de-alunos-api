import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { ValidateAddAccountKeyRepository } from '../../../protocols/db/keys/validate-add-account-key-repository'
import { DbAddAccountRepository } from './db-add-account'

const makeFakeAccount = ():AccountModel => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  id: 'any_id'
})
const makeFakeAddAccount = (): AddAccountModel => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password',
  privateKey: 'any_key'
})

const makeFakeValidateAddAccountKeyStub = (): ValidateAddAccountKeyRepository => {
  class ValidateAddAccountKeyRepositoryStub implements ValidateAddAccountKeyRepository {
    async validateAddKey (key: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new ValidateAddAccountKeyRepositoryStub()
}
const makeLoadAccountByEmailStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  validateAddAccountKeyStub: ValidateAddAccountKeyRepository
  loadAccountByEmailStub: LoadAccountByEmailRepository
  sut: DbAddAccountRepository
}

const makeSut = (): SutTypes => {
  const validateAddAccountKeyStub =  makeFakeValidateAddAccountKeyStub()
  const loadAccountByEmailStub = makeLoadAccountByEmailStub()
  const sut = new DbAddAccountRepository(loadAccountByEmailStub, validateAddAccountKeyStub)

  return {
   sut, 
   loadAccountByEmailStub,
   validateAddAccountKeyStub
  }
}

describe('DbAddAccountRepository', () => { 
  test('should call LoadAccount with correct value', async () => { 
    const { sut, loadAccountByEmailStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByEmailStub, 'loadByEmail')
    await sut.add(makeFakeAddAccount())
    expect(loadAccountSpy).toHaveBeenCalledWith('any_email@mail.com')
   })
   test('should return null if LoadAccount return account', async () => { 
    const { sut, loadAccountByEmailStub } = makeSut()
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.add(makeFakeAddAccount())
    expect(response).toBeFalsy()
   })
   test('should call ValidateKey with correct key', async () => { 
    const { sut, validateAddAccountKeyStub } = makeSut()
    const validateSpy = jest.spyOn(validateAddAccountKeyStub, 'validateAddKey')
    await sut.add(makeFakeAddAccount())
    expect(validateSpy).toHaveBeenCalledWith('any_key')
    })
    test('should return null if  ValidateKey return false', async () => { 
      const { sut, validateAddAccountKeyStub } = makeSut()
      jest.spyOn(validateAddAccountKeyStub, 'validateAddKey').mockReturnValueOnce(Promise.resolve(false))
      const response = await sut.add(makeFakeAddAccount())
      expect(response).toBeFalsy()
      })
 })