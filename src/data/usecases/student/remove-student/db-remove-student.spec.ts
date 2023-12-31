import { Student } from '../../../../domain/models/student'
import { AddStudentModel } from '../../../../domain/usecases/student/add-student'
import { LoadStudentByIdRepository } from '../../../protocols/db/student/load-student-by-id-repository'
import { DbRemoveStudent } from './db-remove-student'

const makeFakeAddStudentModel = (): AddStudentModel => ({
  name: 'any_name',
  age: 0,
  father: 'any_father',
  mother: 'any_mother',
  phone: 0,
  course: ['any_course'],
  payment: 'yes',
  registration: 'active',
  date_payment: ['any_date'],
  id: 'any_id'
})
const makeLoadStudentByIdRepository= (): LoadStudentByIdRepository => {
  class LoadStudentByIdRepositoryStub implements LoadStudentByIdRepository {
    async loadById (id: string): Promise<Student | null> {
      return await Promise.resolve(makeFakeAddStudentModel())
    }
  }
  return new LoadStudentByIdRepositoryStub()

}

interface SutTypes {
  loadStudentStub: LoadStudentByIdRepository
  sut: DbRemoveStudent
}

const makeSut = (): SutTypes => {
  const loadStudentStub = makeLoadStudentByIdRepository()
  const sut = new DbRemoveStudent(loadStudentStub)

  return {
    loadStudentStub,
    sut
  }
} 

describe('DbRemoveStudent', () => {
  test('should call LoadStudent wit correct id', async () => {
    const { sut, loadStudentStub } = makeSut()
    const loadSpy = jest.spyOn(loadStudentStub, 'loadById')
    await sut.remove('any_id')
    expect(loadSpy).toBeCalledWith('any_id')
  })
})