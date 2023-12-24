import { Student } from '../../../../domain/models/student';
import { AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { LoadStudentByName } from '../../../protocols/db/student/load-student-by-name-repository';
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
    date_payment: 'any_date'
})

const makeLoadStudentStub = (): LoadStudentByName => {
  class LoadStudentStub implements LoadStudentByName {
    async loadByName (name: string): Promise<AddStudentModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new LoadStudentStub()
}

interface SuTypes {
  loadStudentStub: LoadStudentByName
  sut: DbAddStudent
}

const makeSut = (): SuTypes => {
  const loadStudentStub = makeLoadStudentStub()
  const sut = new DbAddStudent(loadStudentStub)

  return {
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

})