import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { AddStudentController } from './add-student-controller'

const makeFakeRequest = (): HttpRequest => ({
  body:{
    name: 'any_name',
    age: 0,
    father: 'any_father',
    mother: 'any_mother',
    phone: 0
  }
})

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation(httpRequest: HttpRequest): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  validationStub: Validation,
  sut: AddStudentController
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddStudentController(validationStub)
  return {
    validationStub, 
    sut
  }
}
describe('AddStudentController', () => { 
  test('should call validation with correct values', async () => { 
    const {validationStub, sut} = makeSut()
    const validatorSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
    
  })
})