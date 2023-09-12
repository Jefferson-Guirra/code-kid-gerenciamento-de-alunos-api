import { HttpRequest } from '../../protocols/http'
import { CompareFields } from './compare-fields-validator'

const makeFakeRequest = ():HttpRequest => ({
  body: {
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})
const makeSut= (): CompareFields => new CompareFields('password', 'passwordConfirmation')
describe('CompareFields', () => { 
  test('should return undefined on succeeds', () => {
    const sut = makeSut()
    const response = sut.validation(makeFakeRequest())
    expect(response).toBeFalsy()
  })
})