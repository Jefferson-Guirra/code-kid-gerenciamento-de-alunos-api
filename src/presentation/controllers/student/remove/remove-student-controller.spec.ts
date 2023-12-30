import { RemoveStudent } from '../../../../domain/usecases/student/remove-student';
import { MissingParamsError } from '../../../errors/missing-params-error';
import { badRequest, serverError, unauthorized } from '../../../helpers/http/http';
import { HttpRequest } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';
import { RemoveStudentController } from './remove-student-controller';


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

const makeRemoveStudentStub = (): RemoveStudent => {
  class RemoveStudentStub implements RemoveStudent {
    async remove (id: string): Promise<'removed' | null> {
      return await Promise.resolve('removed')
    }
  }
  return new RemoveStudentStub()
}
interface SutTypes {
  removeStudentStub: RemoveStudent
  validatorStub: Validation
  sut: RemoveStudentController
}

const makeSut = (): SutTypes => {
  const removeStudentStub = makeRemoveStudentStub()
  const validatorStub = makeValidatorStub()
  const sut = new RemoveStudentController(validatorStub, removeStudentStub)
  return {
    sut,
    validatorStub,
    removeStudentStub
  }
}

describe('RemoveStudentController', () => {
  test('should call validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if validator return a error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')))
  })

  test('should call RemoveStudent with correct id', async () => {
    const { sut, removeStudentStub } = makeSut()
    const removeSpy = jest.spyOn(removeStudentStub, 'remove')
    await sut.handle(makeFakeRequest())
    expect(removeSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return 401 if RemoveStudent student return null', async () => {
    const { sut, removeStudentStub } = makeSut()
    jest.spyOn(removeStudentStub, 'remove').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if removeStudent return throw', async () => {
    const { sut, removeStudentStub } = makeSut()
    jest.spyOn(removeStudentStub, 'remove').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error('')))
  })
})