import { HttpRequest } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';
import { RemoveStudentController } from './remove-student-controller';

interface SutTypes {
  validatorStub: Validation
  sut: RemoveStudentController
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    id: 'any_id'
  }
})

const makeValidatorStub = (): Validation => {
  class ValidationStub implements Validation {
    validation(httpRequest: HttpRequest): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new RemoveStudentController(validatorStub)
  return {
    sut,
    validatorStub
  }
}

describe('RemoveStudentController', () => {
  test('should call validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })
})