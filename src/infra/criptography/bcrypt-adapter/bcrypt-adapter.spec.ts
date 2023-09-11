import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt',() => ({
  hash: async (value: string, salt: number): Promise<string> => {
    return await Promise.resolve('hashed_value')
  }
}))

const salt = 12
const makeSut = () => new BcryptAdapter(salt)
describe('BcryptAdapter', () => { 
  test('should call hash with correct value', async () => { 
    const sut = makeSut()
    const  hashSpy =  jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_password')
    expect(hashSpy).toHaveBeenCalledWith('any_password', 12)
  })
  
  test('should return throw if hash fails', async () => { 
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error('')))
    const promise = sut.hash('any_password')
    await expect(promise).rejects.toThrow()
  })

  test('should return hashed password on success', async () => { 
    const sut = makeSut()
    const response = await sut.hash('any_password')
    expect(response).toEqual('hashed_value')
   })
})