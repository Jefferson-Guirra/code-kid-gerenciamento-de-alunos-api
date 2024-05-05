import { AddStudentModel } from '../../../../domain/usecases/student/add-student'
import { UpdateStudent } from '../../../../domain/usecases/student/update-student'
import { MissingParamsError } from '../../../errors/missing-params-error'
import { badRequest, serverError, unauthorized } from '../../../helpers/http/http'
import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'
import { UpdateStudentController} from './update-student-controller'


const makeFakeRequest = (): HttpRequest => ({
  body:{
    id: 'any_id',
    name: 'any_name',
    age: 0,
    father: 'any_father',
    mother:'any_mother',
    phone: 123456789,
    course:['any_course'],
    payment: 'any_payment',
    date_payment: ['any_date'],
    email: 'any_email@mail.com',
    registration: 'active'
  
  }
})

interface SutTypes {
  updateStudentStub: UpdateStudent
  validatorStub: Validation
  sut: UpdateStudentController
}

const makeUpdateStudentStub = (): UpdateStudent => {
  class UpdateStudentStub implements UpdateStudent {
    async update (id: string, updateFields: any) : Promise<AddStudentModel | null> {
      return await Promise.resolve({
        id: 'any_id',
        price: 0,
        name: 'any_name',
        age:15,
        father: 'any_father',
        mother:'any_mother',
        phone: 123456789,
        course: ['any_course'],
        payment: 'any_payment',
        date_payment: ['any_date'],
        email: 'any_email@mail.com',
        registration: 'active',
      })
    }
  }
  return new UpdateStudentStub()
}

const makeValidationStub  = (): Validation => {
  class ValidationUpdateStudentController implements Validation {
    validation(httpRequest: HttpRequest):  Error | undefined {
      return undefined
    }
  }
  return new ValidationUpdateStudentController()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidationStub()
  const updateStudentStub = makeUpdateStudentStub()
  const sut = new UpdateStudentController(validatorStub, updateStudentStub)
  return {
    updateStudentStub,
    validatorStub,
    sut
  }
}

describe('UpdateStudentController', () => {
  test('should call validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
    
  })

  test('should return a error if validator return error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')))
  })

  test('should call UpdateStudent with correct value', async () => {
    const { sut, updateStudentStub } = makeSut()
    const updateSpy = jest.spyOn(updateStudentStub, 'update')
    await sut.handle(makeFakeRequest())
    const {id, ...fields} = makeFakeRequest().body 
    expect(updateSpy).toHaveBeenCalledWith(id, fields)
  })

  test('should return 401 if updateAccount return null', async () => {  
    const { sut, updateStudentStub } = makeSut()
    jest.spyOn(updateStudentStub, 'update').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if UpdateStudentController return throw', async () => {
    const { sut, updateStudentStub } = makeSut()
    jest.spyOn(updateStudentStub, 'update').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error('')))
  })
})