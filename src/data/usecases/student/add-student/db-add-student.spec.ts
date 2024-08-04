import { Student } from '../../../../domain/models/student';
import { AddStudentModel, UserAddStudent } from '../../../../domain/usecases/student/add-student';
import { AccountLoginModel, LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';
import { AddStudentRepository } from '../../../protocols/db/student/add-student-repository';
import { LoadStudentByNameRepository } from '../../../protocols/db/student/load-student-by-name-repository';
import { DbAddStudentRepository } from './db-add-student';

const makeFakeRequest = (): UserAddStudent => ({
    name: 'any_name',
    accessToken: 'any_token',
    age: 0,
    price:0,
    father: 'any_father',
    mother: 'any_mother',
    phone: 0,
    course: ['any_course'],
    email: 'any_email@mail.com',
    payment: 'yes',
    registration: 'active',
    date_payment: ['any_date']
})

const makeFakeAddAccount = (): AccountLoginModel => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  id: 'any_id',
  accessToken: 'any_token',
  units: ['aby_unity']
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

const makeLoadAccountByAccessTokenRepositoryStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessToken implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (accessToken: string):  Promise<AccountLoginModel | null> {
      return await Promise.resolve(makeFakeAddAccount())
    }
  }

  return new LoadAccountByAccessToken()
}

interface SuTypes {
  loadAccountStub: LoadAccountByAccessTokenRepository,
  addStudentStub: AddStudentRepository
  loadStudentStub: LoadStudentByNameRepository
  sut: DbAddStudentRepository
}

const makeSut = (): SuTypes => {
  const loadAccountStub = makeLoadAccountByAccessTokenRepositoryStub()
  const addStudentStub = makeAddStudentRepositoryStub()
  const loadStudentStub = makeLoadStudentStub()
  const sut = new DbAddStudentRepository( loadAccountStub, loadStudentStub, addStudentStub)

  return {
    sut,
    loadAccountStub,
    addStudentStub,
    loadStudentStub,
  }
}

describe('DbAddStudentRepository', () => { 
  test('should call LoadAccountByAccessToken with correct value',  async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub,  'loadByAccessToken')
    await sut.add(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return null if LoadAccountByAccessToken fails',  async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub,  'loadByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.add(makeFakeRequest())
    expect(response).toBeFalsy()
  })

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

  test('should call AddStudentRepository with correct values', async () => {
    const { sut, addStudentStub } = makeSut()
    const addSpy = jest.spyOn(addStudentStub, 'add')
    const {accessToken, ...fakeStudent} = makeFakeRequest()
    await sut.add(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(fakeStudent)
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