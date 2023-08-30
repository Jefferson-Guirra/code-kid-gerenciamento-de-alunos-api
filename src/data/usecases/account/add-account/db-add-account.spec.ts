import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
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
const makeLoadAccountByEmailStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  loadAccountByEmailStub: LoadAccountByEmailRepository
  sut: DbAddAccountRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeLoadAccountByEmailStub()
  const sut = new DbAddAccountRepository(loadAccountByEmailStub)

  return {
   sut, 
   loadAccountByEmailStub
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
 })