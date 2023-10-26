import { AccountModel } from '../../../../domain/models/account'
import { Encrypter } from '../../../protocols/criptography/encrypter'
import { HashCompare } from '../../../protocols/criptography/hash-compare'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  units: ['any_unit']
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
  sut: DbAuthentication
  loadAccountStub: LoadAccountByEmailRepository,
  hashCompareStub: HashCompare,
  encrypterStub: Encrypter
}


const makeSut = (): SutTypes => {
  const loadAccountStub = makeLoadAccountStub()
  const hashCompareStub = makeHashCompareStub()
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAuthentication(loadAccountStub, hashCompareStub, encrypterStub)

  return {
    sut,
    loadAccountStub,
    hashCompareStub,
    encrypterStub
  }

}

describe('first', () => { 
  test('should call LoadAccount with correct values', async () => { 
    const { sut, loadAccountStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountStub, 'loadByEmail')
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return null if loadAccount return null', async () => { 
    const { sut, loadAccountStub } = makeSut() 
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.auth('any_email@mail.com', 'any_password')
    expect(response).toBeFalsy()
  })

  test('should return throw if loadAccount return throw', async () => { 
    const { sut, loadAccountStub }  = makeSut()
    jest.spyOn(loadAccountStub, 'loadByEmail').mockReturnValueOnce(Promise.reject( new Error('')))
    const response = sut.auth('any_email@mail.com', 'any_password')
    await expect(response).rejects.toThrow()
  })

  test('should call hashCompare with correct values', async() => { 
    const { sut, hashCompareStub } = makeSut()
    const hashSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth('any_email@mail.com', 'any_password')
    expect(hashSpy).toHaveBeenCalledWith('any_password', 'any_password')
  })

  test('should return null  if HashCompare return false', async () => {  
    const { sut, hashCompareStub }  = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.auth('any_email@mail.com', 'any_password')
    expect(response).toBeFalsy()
  })

  test('should return 500 if HashCompare fails', async () => { 
    const { sut, hashCompareStub }  = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.reject( new Error('')))
    const promise =  sut.auth('any_email@mail.com', 'any_password')
    await expect(promise).rejects.toThrow()
  })

  test('should call Encrypter with correct values', async() => { 
    const { sut, encrypterStub } = makeSut()
    const hashSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth('any_email@mail.com', 'any_password')
    expect(hashSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return throw if Encrypter fails', async () => { 
    const { sut, encrypterStub }  = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject( new Error('')))
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('should  return accountData on succeeds', async () => { 
    const { sut } = makeSut()
    const response = await sut.auth('any_email@mail.com', 'any_password')
    expect(response).toEqual({
      username: 'any_username',
      email: 'any_email@mail.com',
      accessToken: 'encrypt_value'
    })
  })
 })