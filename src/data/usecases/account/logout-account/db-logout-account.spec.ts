import { AccountModel } from '../../../../domain/models/account';
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';
import { DbLogoutAccount } from './db-logout-account';

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessTokenRepositoryStub implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (accessToken: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccountModel())
    }
  }

  return new LoadAccountByAccessTokenRepositoryStub()
}

interface SutTypes {
  loadAccountStub: LoadAccountByAccessTokenRepository
  sut: DbLogoutAccount
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountStub()
  const sut = new DbLogoutAccount(loadAccountStub)

  return {
    sut,
    loadAccountStub
  }
  
}

describe('DbLogoutAccount', () => { 

  test('should call LoadAccount with correct accessToken', async () => { 
    const { loadAccountStub, sut } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.logout('any_token')
    expect(loadAccountSpy).toBeCalledWith('any_token')
  })

})