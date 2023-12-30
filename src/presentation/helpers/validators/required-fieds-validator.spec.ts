import { InvalidParamsError } from '../../errors/invalid-params-error'
import { MissingParamsError } from '../../errors/missing-params-error'
import { HttpRequest } from '../../protocols/http'
import { RequiredFieldsValidator } from './required-fields-validator'

const makeFakeRequest  = (): HttpRequest => ({
  body: {
    username: 'any_name',
    password:'any_password'
  }
})

const makeSut = () => new RequiredFieldsValidator('email')
describe('RequiredFieldsValidator', () => { 
  test('should  return MissingParamsError if validations fails', () => {
    const sut = makeSut()
    const response = sut.validation(makeFakeRequest())
    expect(response).toEqual(new MissingParamsError('email'))
  })

  test('should  return MissingParamsError if validations fails', () => {
    const sut = makeSut()
    const request = makeFakeRequest()
    request.body.email = 'any_email@mail.com'
    const response = sut.validation(request)
    expect(response).toBeFalsy()
  })
})