import { AddStudentModel } from '../../../../domain/usecases/student/add-student'
import { AccountLoginModel, LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository'
import { UpdateStudentByIdRepository } from '../../../protocols/db/student/update-student-by-id-repository'
import { DbUpdateStudent } from './db-update-student'

const makeFakeAddAccount = (): AccountLoginModel => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  id: 'any_id',
  accessToken: 'any_token',
  units: ['aby_unity']
})


const makeLoadAccountByAccessTokenRepositoryStub = (): LoadAccountByAccessTokenRepository => {
  class LoadAccountByAccessToken implements LoadAccountByAccessTokenRepository {
    async loadByAccessToken (accessToken: string):  Promise<AccountLoginModel | null> {
      return await Promise.resolve(makeFakeAddAccount())
    }
  }

  return new LoadAccountByAccessToken()
}

const makeFakeRequest = () => ({
  id: 'any_id',
  accessToken: 'any_token',
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

interface SutTypes {
  sut: DbUpdateStudent
  loadAccountStub: LoadAccountByAccessTokenRepository
  updateStudentByIdStub: UpdateStudentByIdRepository
}

const makeSut = (): SutTypes =>  {
  const loadAccountStub = makeLoadAccountByAccessTokenRepositoryStub()
  const updateStudentByIdStub = makeUpdateStudentByIdStub()
  const sut = new DbUpdateStudent( loadAccountStub,updateStudentByIdStub)

  return {
    sut, 
    loadAccountStub,
    updateStudentByIdStub
  }

}

describe('DbUpdateStudent', () => {

  test('should  call LoadAccountByAccessTokenRepository with correct value', async () => { 
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByAccessToken')
    await sut.update('any_id', makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
  
  test('should return null if LoadAccountByAccessTokenRepository return null ', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByAccessToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.update('any_id',makeFakeRequest())
    expect(response).toBeFalsy()
  })

  test('should return throw if LoadAccountByAccessTokenRepository fails ', async () => {
    const { sut, loadAccountStub } = makeSut()
    jest.spyOn(loadAccountStub, 'loadByAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const response = sut.update('any_id',makeFakeRequest())
    await expect(response).rejects.toThrow()
  })
  
  test('should call UpdateStudentByIdRepository with correct values', async () => { 
    const { sut, updateStudentByIdStub } = makeSut()
    const updateSpy = jest.spyOn(updateStudentByIdStub, 'updateStudent')
    const { id,accessToken, ...fields} = makeFakeRequest()
    await sut.update('any_id', fields)
    expect(updateSpy).toHaveBeenCalledWith(id, fields)
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