import { AccountModel } from '../../../../domain/models/account';
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';
import { RemoveAccessTokenRepository } from '../../../protocols/db/account/remove-access-token-repository';
import { DbLogoutAccount } from './db-logout-account';

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeRemoveAccessTokenStub = (): RemoveAccessTokenRepository => {
  class RemoveAccessTokenRepositoryStub implements RemoveAccessTokenRepository {
    async removeAccessToken(accessToken: string): Promise<void> {
    }
  }

  return new RemoveAccessTokenRepositoryStub()
}

const makeLoadAccountStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessTokenRepositoryStub implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (accessToken: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccountModel())
    }
  }

  return new LoadAccountByAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbLogoutAccount
  loadAccountStub: LoadAccountByAccessTokenRepository
  removeAccessTokenStub:RemoveAccessTokenRepository

}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountStub()
  const removeAccessTokenStub = makeRemoveAccessTokenStub()
  const sut = new DbLogoutAccount(loadAccountStub, removeAccessTokenStub)

  return {
    sut,
    loadAccountStub,
    removeAccessTokenStub
  }
  
}

describe('DbLogoutAccount', () => { 

  test('should call LoadAccount with correct accessToken', async () => { 
    const { loadAccountStub, sut } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.logout('any_token')
    expect(loadAccountSpy).toBeCalledWith('any_token')
  })

  test('should return null if LoadAccount return null', async () => { 
    const { loadAccountStub, sut } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.logout('any_token')
    expect(response).toBeFalsy()
  })

  test('should return throw LoadAccount fails', async () => { 
    const { loadAccountStub, sut } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByAccessToken').mockReturnValueOnce(Promise.reject(new Error('')))
    const response =  sut.logout('any_token')
    await expect(response).rejects.toThrow()
  })

  test('should call RemoveAccessToken with correct accessToken', async () => { 
    const { removeAccessTokenStub, sut } = makeSut()
    const removeAccessSpy = jest.spyOn(removeAccessTokenStub, 'removeAccessToken')
    await sut.logout('any_token')
    expect(removeAccessSpy).toBeCalledWith('any_token')
  })

  test('should return throw RemoveAccessToken fails', async () => { 
    const { removeAccessTokenStub, sut } = makeSut()
    jest.spyOn(removeAccessTokenStub, 'removeAccessToken').mockReturnValueOnce(Promise.reject(new Error('')))
    const response =  sut.logout('any_token')
    await expect(response).rejects.toThrow()
  })
  
  test('should return success message', async () => {
    const { sut } =  makeSut()
    const response = await sut.logout('any_token')
    expect(response).toBe('success')
  })
})