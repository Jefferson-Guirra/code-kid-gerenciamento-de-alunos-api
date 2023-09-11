import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt',() => ({
  hash: async (value: string, salt: number): Promise<string> => {
    return await Promise.resolve('hashed_password')
  }
}))

const salt = 12
const makeSUt = () => new BcryptAdapter(salt)
describe('BcryptAdapter', () => { 
  test('should call hash with correct value', async () => { 
    const sut = makeSUt()
    const  hashSpy =  jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_password')
    expect(hashSpy).toHaveBeenCalledWith('any_password', 12)

  })
})