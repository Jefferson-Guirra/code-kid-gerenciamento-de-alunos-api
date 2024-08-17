import { StudentModel } from '../../../../domain/models/student'
import { AccountLoginModel, LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { LoadStudentByIdRepository } from '../../../protocols/db/student/load-student-by-id-repository'
import { RemoveStudentByIdRepository } from '../../../protocols/db/student/remove-student-by-id-repository'
import { DbRemoveStudent } from './db-remove-student'

const makeFakeAddStudentModel = (): StudentModel => ({
  name: 'any_name',
  age: 0,
  price:0,
  email: 'any_email@mail.com',
  father: 'any_father',
  mother: 'any_mother',
  phone: 0,
  course: ['any_course'],
  payment: 'yes',
  registration: 'active',
  date_payment: ['any_date'],
  id: 'any_id'
})

const makeFakeAccountLoginModel = (): AccountLoginModel => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  id: 'any_id',
  accessToken: 'any_token',
  units: ['aby_unity']
})

const makeLoadAccountByAccessTokenRepositoryStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountStub implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (accessToken: string): Promise<AccountLoginModel | null> {
      return await Promise.resolve(makeFakeAccountLoginModel()) 
    }
  }

  return new LoadAccountStub()

}
const makeLoadStudentByIdRepository= (): LoadStudentByIdRepository => {
  class LoadStudentByIdRepositoryStub implements LoadStudentByIdRepository {
    async loadById (id: string): Promise<StudentModel | null> {
      return await Promise.resolve(makeFakeAddStudentModel())
    }
  }
  return new LoadStudentByIdRepositoryStub()

}

const makeRemoveStudentByIdRepositoryStub = (): RemoveStudentByIdRepository => {
  class RemoveStudentByIdRepositoryStub implements RemoveStudentByIdRepository {
    async removeById (id: string): Promise<string> {
      return await Promise.resolve('removed')
    }
  }
  return new RemoveStudentByIdRepositoryStub()
}

interface SutTypes {
  loadAccountStub: LoadAccountByAccessTokenRepository,
  removeStudentRepositoryStub: RemoveStudentByIdRepository
  loadStudentStub: LoadStudentByIdRepository
  sut: DbRemoveStudent
}

const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountByAccessTokenRepositoryStub()
  const removeStudentRepositoryStub = makeRemoveStudentByIdRepositoryStub()
  const loadStudentStub = makeLoadStudentByIdRepository()
  const sut = new DbRemoveStudent(loadAccountStub,loadStudentStub, removeStudentRepositoryStub)

  return {
    loadAccountStub,
    removeStudentRepositoryStub,
    loadStudentStub,
    sut
  }
} 

describe('DbRemoveStudent', () => {
  test('should call LoadAccount wit correct value', async () => {
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.remove('any_token','any_id')
    expect(loadSpy).toBeCalledWith('any_token')
  })

  test('should return null if LoadAccount return null ', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const response  = await sut.remove('any_token','any_id')
    expect(response).toBeFalsy()
  })

  test('should return throw if LoadAccount fails ', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const response  = sut.remove('any_token','any_id')
   await  expect(response).rejects.toThrow()
  })

  test('should call LoadStudent wit correct id', async () => {
    const { sut, loadStudentStub } = makeSut()
    const loadSpy = jest.spyOn(loadStudentStub, 'loadById')
    await sut.remove('any_token','any_id')
    expect(loadSpy).toBeCalledWith('any_id')
  })

  test('should return throw id LoadStudent fails', async () => {
    const { sut, loadStudentStub } = makeSut()
    jest.spyOn(loadStudentStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.remove('any_token','any_id')
    await expect(response).rejects.toThrow()
  })

  test('should return null if LoadStudent return null', async () => {
    const { sut, loadStudentStub } = makeSut()
    jest.spyOn(loadStudentStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.remove('any_token','any_id')
    expect(response).toBeFalsy()
  })

  test('should call RemoveStudent wit correct id', async () => {
    const { sut, removeStudentRepositoryStub } = makeSut()
    const removeSpy = jest.spyOn(removeStudentRepositoryStub, 'removeById')
    await sut.remove('any_token','any_id')
    expect(removeSpy).toBeCalledWith('any_id')
  })

  test('should return throw id RemoveStudent fails', async () => {
    const { sut, removeStudentRepositoryStub } = makeSut()
    jest.spyOn(removeStudentRepositoryStub, 'removeById').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.remove('any_token','any_id')
    await expect(response).rejects.toThrow()
  })

  test('should return message on succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.remove('any_token','any_id')
    expect(response).toEqual('removed')
  })

})