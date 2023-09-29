import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => 'encrypt_value'
}))

const makeSut = (): JwtAdapter => new JwtAdapter('any_secret_key')

describe('JwtAdapter', () => { 
  test('should call jsonWebToken with correct values', async () => {  
    const sut = makeSut()
    const encryptSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(encryptSpy).toBeCalledWith({ id: 'any_value'}, 'any_secret_key')
  })

  test('should return throw if jsonWebToken fails', async () => {  
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error('')
    })
    const promise =  sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('should return Encrypted value on succeeds', async () => { 
    const sut = makeSut()
    const response =  await sut.encrypt('any_value')
    expect(response).toEqual('encrypt_value')
  })

})