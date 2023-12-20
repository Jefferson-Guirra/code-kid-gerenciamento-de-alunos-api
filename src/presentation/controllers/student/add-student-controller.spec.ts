import { Student } from '../../../domain/models/student'
import { AddStudent, AddStudentModel } from '../../../domain/usecases/student/add-student'
import { MissingParamsError } from '../../errors/missing-params-error'
import { badRequest } from '../../helpers/http/http'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { AddStudentController } from './add-student-controller'

const makeFakeRequest = (): HttpRequest => ({
  body:{
    name: 'any_name',
    age: 0,
    father: 'any_father',
    mother: 'any_mother',
    phone: 0,
    course: ['any_course'],
    payment: 'yes',
    date_payment: 'any_date'
  }
})

const makeFakeAddStudentModel = (): AddStudentModel => ({
  name: 'any_name',
  age: 0,
  father: 'any_father',
  mother: 'any_mother',
  phone: 0,
  course: ['any_course'],
  payment: 'yes',
  date_payment: 'any_date',
  id:'any_id'
})

const makeAddStudentStub = (): AddStudent => {
  class AddStudentStub implements AddStudent {
    add(student: Student): AddStudentModel | null {
      return makeFakeAddStudentModel()
    }
  }
  return new AddStudentStub()
}

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
  addStudentStub: AddStudent,
  sut: AddStudentController
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addStudentStub = makeAddStudentStub()
  const sut = new AddStudentController(validationStub, addStudentStub)
  return {
    validationStub, 
    addStudentStub,
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
  test('should return 401 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validation').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')))
  })

  test('should call AddStudent with correct values', async () => {
    const { sut, addStudentStub } = makeSut()
    const addSpy = jest.spyOn(addStudentStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toBeCalledWith(makeFakeRequest().body)
  })

})