import { UnnecessaryParamsError } from '../../errors/unecessary-params-error';
import { HttpRequest } from '../../protocols/http';
import { CheckRequestValidator } from './check-request-validator';

const makeFakeRequest = (): HttpRequest => ({
  body : {
    any_field: 'any_field',
    random_field: 'random_field',
    field: 'any_field'
  }
})

const makeSut = (paramsValidate: string[]) => new CheckRequestValidator(paramsValidate)
describe('CheckRequestValidator', () => {
  test('should return UnnecessaryParamsError if validation fails', () => {
    const sut = makeSut(['any_field'])
    const response = sut.validation(makeFakeRequest())
    expect(response).toEqual(new UnnecessaryParamsError(['random_field', 'field'].toString()))
  })

  test('should return undefined on succeeds', () => {
    const sut = makeSut(['any_field', 'random_field', 'field'])
    const response = sut.validation(makeFakeRequest())
    expect(response).toBeFalsy()
  })
})
