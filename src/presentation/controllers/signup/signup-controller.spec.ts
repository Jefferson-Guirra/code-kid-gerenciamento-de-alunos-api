import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { SignUpController } from './signup-controller'

const makeFakeAddAccount = (): HttpRequest => ({
  body: {  
    username: 'any_username',
    email: 'any_username',
    password: 'string',
    passwordConfirmation: 'any_username',
    privateKey: 'any_key'
  }
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (httpRequest: HttpRequest):  Error | undefined {
      return undefined
    } 
  }

  return new ValidationStub()
}

interface SutTypes {
  validationStub: Validation,
  sut: SignUpController
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new SignUpController(validationStub)

  return {
    validationStub,
    sut
  }
}

describe('SignUpController', () => { 
  test('should call validation with correct values', async () => { 
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeAddAccount())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeAddAccount())
   })
})