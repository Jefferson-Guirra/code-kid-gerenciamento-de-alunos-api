import { HttpRequest } from '../../../protocols/http'
import { Validation } from '../../../protocols/validation'
import { UpdateStudentController} from './update-student-controller'


const makeFakeRequest = (): HttpRequest => ({
  body:{
    name: 'any_name',
    age: 'any_number',
    father: 'any_father',
    mother:'any_mother',
    phone: 'any_phone',
    course: '[any_course]',
    payment: 'any_payment',
    date_payment: ['any_date'],
    email: 'any_email@mail.com',
    registration: 'active'
  
  }
})

interface SutTypes {
  validatorStub: Validation
  sut: UpdateStudentController
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
  const sut = new UpdateStudentController(validatorStub)
  return {
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
})