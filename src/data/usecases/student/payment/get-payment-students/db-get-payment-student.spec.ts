import { AddStudentModel } from '../../../../../domain/usecases/student/add-student';
import { getPaymentStudentsRepository } from '../../../../protocols/db/student/get-payment-students-repository';
import { DbGetPaymentStudents } from './db-get-payment-students';


const makeFakeAddStudentModel = (): AddStudentModel => ({
  name: 'any_name',
  age: 0,
  price:0,
  father: 'any_father',
  mother: 'any_mother',
  phone: 0,
  course: ['any_course'],
  email: 'any_email@mail.com',
  payment: 'yes',
  registration: 'active',
  date_payment: ['any_date'],
  id: 'any_id'
})


const makeGetPaymentStudentsRepositoryStub = (): getPaymentStudentsRepository => {
  class getPaymentStudentsRepositoryStub implements getPaymentStudentsRepository {
    async getPaymentStudents (payment: string): Promise<AddStudentModel[] | null> {
      const fakeAddStudentModel = [makeFakeAddStudentModel(), makeFakeAddStudentModel()]
      return await Promise.resolve(fakeAddStudentModel)
    }
  }
  return new getPaymentStudentsRepositoryStub()
}

interface sutTypes {
  getPaymentStudentsRepositoryStub: getPaymentStudentsRepository
  sut: DbGetPaymentStudents

}

const makeSut = (): sutTypes => {
  const getPaymentStudentsRepositoryStub = makeGetPaymentStudentsRepositoryStub()
  const sut = new DbGetPaymentStudents(getPaymentStudentsRepositoryStub)

  return {
    getPaymentStudentsRepositoryStub,
    sut
  }
}


describe('DbGetPaymentStudents', () => {

  test('should call getPaymentStudentsRepository with correct value', async () => {  
    const { getPaymentStudentsRepositoryStub, sut } = makeSut()
    const paymentSpy = jest.spyOn(getPaymentStudentsRepositoryStub, 'getPaymentStudents')
    await sut.getStudents('yes')
    expect(paymentSpy).toHaveBeenCalledWith('yes')
  })

  test('should return null if getPaymentStudentsRepository return null', async () => {  
    const { getPaymentStudentsRepositoryStub, sut } = makeSut()
    jest.spyOn(getPaymentStudentsRepositoryStub, 'getPaymentStudents').mockReturnValueOnce(Promise.resolve(null))
    const response  = await sut.getStudents('yes')
    expect(response).toBeFalsy()
  })
})