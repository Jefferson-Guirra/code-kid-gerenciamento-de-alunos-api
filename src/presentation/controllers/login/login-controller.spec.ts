import { AccountModel } from '../../../domain/models/account'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/account/authentication'
import { MissingParamsError } from '../../errors/missing-params-error'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
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

const makeValidatorStub = (): Validation => {
  class ValidatorStub implements Validation{
    validation(httpRequest: HttpRequest): Error | undefined {
      return
    }
  }
  return new ValidatorStub()
}
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
  validatorStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(validatorStub, authenticationStub)
  return {
    sut,
    validatorStub,
    authenticationStub
  }

}

describe('LoginController', () => { 
  test('should call Validation with correct value', async () => { 
     const { sut, validatorStub } = makeSut()
     const validatorSpy = jest.spyOn(validatorStub, 'validation')
     await sut.handle(makeFakeRequest())
     expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400  if validation fails', async () => { 
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')))
 })

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

   test('should return 500 if authentication fails', async () => { 
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error('')))
   })
})
