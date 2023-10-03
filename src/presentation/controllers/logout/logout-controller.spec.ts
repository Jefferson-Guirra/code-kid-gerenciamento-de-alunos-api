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

interface SutTypes {
  sut: LogoutController,
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new LogoutController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('LogoutController', () => { 
  test('should call Validation with correct value', async () => { 
    const { sut, validationStub } = makeSut()
    const validatorSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())

  })

})