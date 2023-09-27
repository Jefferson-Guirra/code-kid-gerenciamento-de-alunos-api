import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import { HashCompare } from '../../../data/protocols/criptography/hash-compare'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository'
import { AccountModel } from '../../../domain/models/account'
import { ok, serverError, unauthorized } from '../../helpers/http/http'
import { HttpRequest } from '../../protocols/http'
import { LoginController } from './login-controller'

const makeFakeRequest= (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('encrypt_value')
    }
  }
  return new EncrypterStub()
}
const makeHashCompareStub = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, compareValue: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashCompareStub()
}
const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositorySub implements LoadAccountByEmailRepository  {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccountModel())
    }
  }
  return new LoadAccountByEmailRepositorySub()
}
interface SutTypes {
  sut: LoginController
  loadAccountStub: LoadAccountByEmailRepository,
  hashCompareStub: HashCompare,
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const loadAccountStub = makeLoadAccountStub()
  const hashCompareStub = makeHashCompareStub()
  const sut = new LoginController(loadAccountStub, hashCompareStub, encrypterStub)
  return {
    sut,
    loadAccountStub,
    hashCompareStub,
    encrypterStub
  }

}

describe('LoginController', () => { 
  test('should call LoadAccount with correct values', async () => { 
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByEmail')
    await sut.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 401 if loadAccount return null', async () => { 
    const { sut, loadAccountStub } = makeSut() 
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('should return throw if loadAccount return throw', async () => { 
     const { sut, loadAccountStub }  = makeSut()
     jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.reject( new Error('')))
     const response = await sut.handle(makeFakeRequest())
     expect(response).toEqual(serverError(new Error('')))
  })

  test('should call hashCompare with correct values', async() => { 
    const { sut, hashCompareStub } = makeSut()
    const hashSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.handle(makeFakeRequest())
    expect(hashSpy).toHaveBeenCalledWith('any_password', 'any_password')
  })

  test('should return 401  if HashCompare return false', async () => {  
    const { sut, hashCompareStub }  = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })


  test('should return 500 if HashCompare fails', async () => { 
    const { sut, hashCompareStub }  = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.reject( new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error('')))
  })

  test('should call Encrypter with correct values', async() => { 
    const { sut, encrypterStub } = makeSut()
    const hashSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.handle(makeFakeRequest())
    expect(hashSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return 500 if Encrypter fails', async () => { 
    const { sut, encrypterStub }  = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject( new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error('')))
  })

  test('should return 200 on succeeds', async () => {
    const  { sut } = makeSut() 
    const response =  await  sut.handle(makeFakeRequest())
    expect(response).toEqual(ok({ accessToken: 'encrypt_value', username: 'any_username'}))
  })
})