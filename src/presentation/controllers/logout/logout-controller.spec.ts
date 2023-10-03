import { AccountLogout } from '../../../domain/usecases/account/logout-account';
import { MissingParamsError } from '../../errors/missing-params-error';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http';
import { HttpRequest } from '../../protocols/http';
import { Validation } from '../../protocols/validation';
import { LogoutController } from './logout-controller';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    accessToken: 'any_token'
  }
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (httpRequest: HttpRequest): Error | undefined {
      return
    }
  }
  return new ValidationStub()
}

const makeDbAccountLogout = (): AccountLogout => {
  class DbAccountLogoutStub implements AccountLogout {
    async logout (accessToken: string): Promise<string | undefined> {
      return await Promise.resolve('logout_success')
    }
  }
  return new DbAccountLogoutStub()
}

interface SutTypes {
  sut: LogoutController,
  validationStub: Validation
  DbAccountLogout: AccountLogout
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const DbAccountLogout = makeDbAccountLogout()
  const sut = new LogoutController(validationStub, DbAccountLogout)
  return {
    sut,
    validationStub,
    DbAccountLogout
  }
}

describe('LogoutController', () => { 
  test('should call Validation with correct value', async () => { 
    const { sut, validationStub } = makeSut()
    const validatorSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if Validation return a error', async () => { 
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validation').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')))
  })

  test('should call AccountLogout with correct value', async () => { 
    const { sut, DbAccountLogout } = makeSut()
    const logoutSpy = jest.spyOn(DbAccountLogout, 'logout')
    await sut.handle(makeFakeRequest())
    expect(logoutSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return 401 if AccountLogout return undefined', async () => { 
    const { sut, DbAccountLogout } = makeSut()
    jest.spyOn(DbAccountLogout, 'logout').mockReturnValueOnce(Promise.resolve(undefined))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if AccountLogout fails', async () => { 
    const { sut, DbAccountLogout } = makeSut()
    jest.spyOn(DbAccountLogout, 'logout').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error('')))
  })

  test('should return 200 on succeeds', async () => { 
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok({ message: 'logout success'}))
  })

})