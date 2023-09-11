import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { Hasher } from '../../../protocols/criptography/hasher'
import { AddAccountRepository } from '../../../protocols/db/account/add-account-repository'
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

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(password: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}
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

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async addAccount (account: AddAccountModel): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())

    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  hasherStub: Hasher
  addAccountStub: AddAccountRepository
  validateAddAccountKeyStub: ValidateAddAccountKeyRepository
  loadAccountByEmailStub: LoadAccountByEmailRepository
  sut: DbAddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountRepositoryStub()
  const validateAddAccountKeyStub =  makeFakeValidateAddAccountKeyStub()
  const loadAccountByEmailStub = makeLoadAccountByEmailStub()
  const hasherStub = makeHasherStub()
  const sut = new DbAddAccountRepository(loadAccountByEmailStub, validateAddAccountKeyStub, addAccountStub, hasherStub)

  return {
   sut, 
   loadAccountByEmailStub,
   validateAddAccountKeyStub,
   addAccountStub,
   hasherStub
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

  test('should return throw if LoadAccount fails', async () => { 
  const { sut, loadAccountByEmailStub } = makeSut()
  jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error('')))
  const promise =  sut.add(makeFakeAddAccount())
  await expect(promise).rejects.toThrow()
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

  test('should return throw if ValidateKey fails', async () => { 
    const { sut, validateAddAccountKeyStub } = makeSut()
    jest.spyOn(validateAddAccountKeyStub, 'validateAddKey').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise =  sut.add(makeFakeAddAccount())
    await expect(promise).rejects.toThrow()
  })

  test('should call Hash with correct password', async () => { 
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAddAccount())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('should return throw if Hash fails', async () => { 
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise = sut.add(makeFakeAddAccount())
    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccount with correct values', async () => { 
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'addAccount')
    const {password, passwordConfirmation, ...rest} = makeFakeAddAccount()
    await sut.add(makeFakeAddAccount())
    expect(addSpy).toHaveBeenCalledWith({
      password: 'hashed_password',
      passwordConfirmation: 'hashed_password',
      ...rest
    })
  })

  test('should return throw if AddAccount fails', async () => { 
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'addAccount').mockReturnValueOnce(Promise.reject(new Error('')))
    const promise =  sut.add(makeFakeAddAccount())
    await expect(promise).rejects.toThrow()
  })

  test('should return account on succeeds', async () => { 
    const { sut } = makeSut()
    const response =   await sut.add(makeFakeAddAccount())
    expect(response).toEqual(makeFakeAccount())
  })
 })