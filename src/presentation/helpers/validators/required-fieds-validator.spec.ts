import { InvalidParamsError } from '../../errors/invalid-params-error'
import { HttpRequest } from '../../protocols/http'
import { RequiredFieldsValidator } from './required-fields-validator'

const makeFakeRequest  = (): HttpRequest => ({
  body: {
    username: 'any_name',
    password:'any_password'
  }
})

const makeSut = () => new RequiredFieldsValidator([ 'username', 'email', 'password'])
describe('RequiredFieldsValidator', () => { 
  test('should  return MissingParamsError if validations fails', () => {
    const sut = makeSut()
    const response = sut.validation(makeFakeRequest())
    expect(response).toEqual(new InvalidParamsError('email'))

  })
})