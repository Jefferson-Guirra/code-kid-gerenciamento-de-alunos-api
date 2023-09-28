import { AccountModel } from '../../../domain/models/account'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/account/authentication'
import { ok, serverError, unauthorized } from '../../helpers/http/http'
import { HttpRequest } from '../../protocols/http'
import { LoginController } from './login-controller'

const makeFakeRequest= (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeFakeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any_emmail@mail.com',
  username: 'any_username',
  accessToken: 'any_token'
})

const makeAuthenticationStub = (): Authentication => {
  class DbAuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<AuthenticationModel | null> {
      return await Promise.resolve(makeFakeAuthenticationModel())
    }
  }
  return new DbAuthenticationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(authenticationStub)
  return {
    sut,
    authenticationStub
  }

}

describe('LoginController', () => { 
  test('should call authentication with correct values', async () => { 
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
   })

   test('should return 401 if authentication return null', async () => { 
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
   })
})
