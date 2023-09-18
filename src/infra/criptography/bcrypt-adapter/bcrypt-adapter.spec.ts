import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt',() => ({
  hash: async (value: string, salt: number): Promise<string> => {
    return await Promise.resolve('hashed_value')
  },
  compare: async (value: string, compareValue: string): Promise<boolean>  => {
    return await Promise.resolve(true)
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

   test('should call Compare with correct values', async () => { 
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'random_value')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'random_value')
    })
    test('should return throw if Compare fails', async () => { 
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.reject(new Error('')))
      const response = sut.compare('any_value', 'random_value')
      await expect(response).rejects.toThrow()
      })
})