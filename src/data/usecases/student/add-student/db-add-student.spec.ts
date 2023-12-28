import { Student } from '../../../../domain/models/student';
import { AddStudent, AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { AddStudentRepository } from '../../../protocols/db/student/add-student-repository';
import { LoadStudentByNameRepository } from '../../../protocols/db/student/load-student-by-name-repository';
import { DbAddStudent } from './db-add-student';

const makeFakeRequest = (): Student => ({
    name: 'any_name',
    age: 0,
    father: 'any_father',
    mother: 'any_mother',
    phone: 0,
    course: ['any_course'],
    payment: 'yes',
    registration: 'active',
    date_payment: ['any_date']
})

const makeLoadStudentStub = (): LoadStudentByNameRepository => {
  class LoadStudentStub implements LoadStudentByNameRepository {
    async loadByName (name: string): Promise<AddStudentModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new LoadStudentStub()
}

const makeAddStudentRepositoryStub = (): AddStudentRepository => {
  class AddStudentRepositoryStub implements AddStudentRepository {
    async add(student: Student): Promise<AddStudentModel | null> {
      return await Promise.resolve({...makeFakeRequest(), id: 'any_id'})
    }
  }
  return new AddStudentRepositoryStub()
}

interface SuTypes {
  addStudentStub: AddStudentRepository
  loadStudentStub: LoadStudentByNameRepository
  sut: DbAddStudent
}

const makeSut = (): SuTypes => {
  const addStudentStub = makeAddStudentRepositoryStub()
  const loadStudentStub = makeLoadStudentStub()
  const sut = new DbAddStudent(loadStudentStub, addStudentStub)

  return {
    addStudentStub,
    loadStudentStub,
    sut
  }
}

describe('DbAddStudent', () => { 
  test('should call LoadStudent with correct name', async () => {
    const { sut, loadStudentStub } = makeSut()
    const loadSpy = jest.spyOn(loadStudentStub, 'loadByName')
    await sut.add(makeFakeRequest())
    expect(loadSpy).toBeCalledWith('any_name')
  })

  test('should return null if LoadStudent return a student', async () => {
    const { sut, loadStudentStub } = makeSut()
    jest.spyOn(loadStudentStub, 'loadByName').mockReturnValueOnce(Promise.resolve({...makeFakeRequest(), id: 'any_id'}))
    const response = await sut.add(makeFakeRequest())
    expect(response).toBeFalsy()
  })

  test('should return throw if loadAccount fails', async () => {
    const { sut, loadStudentStub } = makeSut()
    jest.spyOn(loadStudentStub, 'loadByName').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.add(makeFakeRequest())
    await expect(response).rejects.toThrow()
  })

  test('should call ASddStudentRepository with correct values', async () => {
    const { sut, addStudentStub } = makeSut()
    const addSpy = jest.spyOn(addStudentStub, 'add')
    await sut.add(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return throw if AddStudentRepository fails', async () => {
    const { sut, addStudentStub } = makeSut()
    jest.spyOn(addStudentStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.add(makeFakeRequest())
    await expect(response).rejects.toThrow()
  })

  test('should return a student on succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.add(makeFakeRequest())
    expect(response).toEqual({ ...makeFakeRequest(), id: 'any_id' })
  })

})