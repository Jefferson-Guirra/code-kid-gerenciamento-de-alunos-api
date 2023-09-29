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

})