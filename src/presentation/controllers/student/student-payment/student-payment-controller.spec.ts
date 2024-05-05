import { HttpRequest } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';
import { StudentPaymentController } from './student-payment-controller';

const makeFakeRequest = (): HttpRequest  => ({
  body: {
    payment: 'yes'
  }
})

const makeValidatorStub = (): Validation => {
  class ValidatorStub  implements Validation {
    validation(httpRequest: HttpRequest): Error | undefined {
      return undefined
    }
  }
  return new ValidatorStub()
}

interface SutTypes {
  validatorStub: Validation
  sut: StudentPaymentController
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new StudentPaymentController(validatorStub)
  return {
    validatorStub,
    sut
  }
}

describe('StudentPaymentController', () => {
  test('should call Validator with correct value', async () => {
    const { sut, validatorStub} = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())

  })
})