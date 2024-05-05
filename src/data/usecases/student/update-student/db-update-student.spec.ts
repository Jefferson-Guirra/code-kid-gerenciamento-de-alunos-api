import { AddStudentModel } from '../../../../domain/usecases/student/add-student'
import { UpdateStudentByIdRepository } from '../../../protocols/db/student/update-student-by-id-repository'
import { DbUpdateStudent } from './db-update-student'

interface SutTypes {
  sut: DbUpdateStudent
  updateStudentByIdStub: UpdateStudentByIdRepository
}

const makeFakeRequest = () => ({
  phone: 12345,
  name: 'random_name'

})

const updateStudentStub = (): AddStudentModel => ({
  id: 'any_id',
  name: 'any_name',
  price: 0,
  age: 0,
  father: 'any_father',
  mother:'any_mother',
  phone: 123456789,
  course:['any_course'],
  payment: 'any_payment',
  date_payment: ['any_date'],
  email: 'any_email@mail.com',
  registration: 'active'
})

const makeUpdateStudentByIdStub = (): UpdateStudentByIdRepository => {
  class updateStudentByIdRepositoryStub implements UpdateStudentByIdRepository {
    async updateStudent (id: string, updateFields: any): Promise<AddStudentModel | null> {
      return await Promise.resolve(updateStudentStub()) 
    }
  }
  return new updateStudentByIdRepositoryStub()
} 

const makeSut = (): SutTypes =>  {
  const updateStudentByIdStub = makeUpdateStudentByIdStub()
  const sut = new DbUpdateStudent(updateStudentByIdStub)

  return {
    sut, 
    updateStudentByIdStub
  }

}

describe('DbUpdateStudent', () => {

  test('should UpdateStudentByIdRepository call UpdateStudentByIdRepository with correct values', async () => { 
    const { sut, updateStudentByIdStub } = makeSut()
    const updateSpy = jest.spyOn(updateStudentByIdStub, 'updateStudent')
    await sut.update('any_id', makeFakeRequest())
    expect(updateSpy).toHaveBeenCalledWith('any_id', makeFakeRequest())
  })

  test('should return throw if UpdateStudentByIdRepository fails ', async () => {
    const { sut, updateStudentByIdStub } = makeSut()
    jest.spyOn(updateStudentByIdStub, 'updateStudent').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.update('any_id',makeFakeRequest())
    await expect(response).rejects.toThrow()
  })

  test('should return null if student not exist', async () => {
    const { sut, updateStudentByIdStub } = makeSut()
    jest.spyOn(updateStudentByIdStub, 'updateStudent').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.update('any_id', makeFakeRequest())
    expect(response).toBeFalsy()

  })

  test('should return UpdateStudent on succeeds', async () => {
    const {sut} = makeSut()
    const response = await sut.update('any_id',makeFakeRequest())
    expect(response).toEqual(updateStudentStub())
  })
})