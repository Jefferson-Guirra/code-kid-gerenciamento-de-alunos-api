import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository'
import { AccountModel } from '../../../domain/models/account'
import { serverError, unauthorized } from '../../helpers/http/http'
import { HttpRequest } from '../../protocols/http'
import { LoginController } from './login-controller'

const makeFakeRequest= (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositorySub implements LoadAccountByEmailRepository  {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccountModel())
    }
  }
  return new LoadAccountByEmailRepositorySub()
}
interface SutTypes {
  loadAccountStub: LoadAccountByEmailRepository
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountStub()
  const sut = new LoginController(loadAccountStub)
  return {
    sut,
    loadAccountStub
  }

}

describe('LoginController', () => { 
  test('should call LoadAccount with correct values', async () => { 
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByEmail')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  test('should return 401 if loadAccount return null', async () => { 
    const { sut, loadAccountStub } = makeSut() 
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })
  test('should return throw if loadAccount return throw', async () => { 
     const { sut, loadAccountStub }  = makeSut()
     jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.reject( new Error('')))
     const response = await sut.handle(makeFakeRequest())
     expect(response).toEqual(serverError(new Error('')))
     
  })
})