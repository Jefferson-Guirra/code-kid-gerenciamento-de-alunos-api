import { StudentModel } from '../../../../domain/models/student';
import { AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { PaymentStudents, UserGetPayment } from '../../../../domain/usecases/student/payment-student';
import { MissingParamsError } from '../../../errors/missing-params-error';
import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http';
import { HttpRequest } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';
import { StudentPaymentController } from './student-payment-controller';

const makeFakeStudent  = (): StudentModel => ({
  name: 'any_name',
  id: 'any_id',
  email: 'any_email@mail.com',
  price: 0,
  age: 0,
  father: 'any_father',
  mother: 'any_mother',
  phone: 0,
  course: ['any_course'],
  payment: 'yes',
  registration: 'active',
  date_payment: ['any_date']
})

const makeGetPaymentStudents = (): PaymentStudents => {
  class GetPaymentStudents implements PaymentStudents {
    async getStudents (payment: UserGetPayment): Promise<StudentModel[] | null> {
      return Promise.resolve([makeFakeStudent(), makeFakeStudent()])

    }
  }
  return new GetPaymentStudents()
}

const makeFakeRequest = (): HttpRequest  => ({
  body: {
    payment: 'yes',
    accessToken: 'any_token'
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
  getPaymentStudentsStub: PaymentStudents
  validatorStub: Validation
  sut: StudentPaymentController
}

const makeSut = (): SutTypes => {
  const getPaymentStudentsStub = makeGetPaymentStudents()
  const validatorStub = makeValidatorStub()
  const sut = new StudentPaymentController(validatorStub, getPaymentStudentsStub)
  return {
    getPaymentStudentsStub,
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

  test('should return 400 if Validator return a error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validation').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')))
  })

  test('should call PaymentStudents with correct value', async () => {
    const { sut,getPaymentStudentsStub } = makeSut()
    const getSpy = jest.spyOn(getPaymentStudentsStub, 'getStudents')
    await sut.handle(makeFakeRequest())
    expect(getSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('should return 401 if Authentication fails ', async () => {
    const { sut,getPaymentStudentsStub } = makeSut()
    jest.spyOn(getPaymentStudentsStub, 'getStudents').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return 500 if PaymentStudents return throw ', async () => {
    const { sut, getPaymentStudentsStub } =makeSut()
    jest.spyOn(getPaymentStudentsStub, 'getStudents').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 200 not body request', async () => {
    const { sut, getPaymentStudentsStub } = makeSut()
    jest.spyOn(getPaymentStudentsStub, 'getStudents').mockReturnValueOnce(Promise.resolve([]))
    const response = await sut.handle({ body: { payment: null}})
    expect(response).toEqual(ok([]))
  })

  test('should return 200 on succeeds', async () => {
    const { sut } =makeSut()
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(ok([makeFakeStudent(), makeFakeStudent()]))
  })
})