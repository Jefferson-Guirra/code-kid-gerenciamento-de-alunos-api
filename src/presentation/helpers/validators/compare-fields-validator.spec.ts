import { InvalidParamsError } from '../../errors/invalid-params-error'
import { HttpRequest } from '../../protocols/http'
import { CompareFields } from './compare-fields-validator'

const makeFakeRequest = (value?: string):HttpRequest => {
  const body ={
    field: 'any_password',
    fieldToCompare: 'any_password'
  }

  if(value) body.fieldToCompare = value
  return { body }
  

}
const makeSut= (): CompareFields => new CompareFields('field', 'fieldToCompare')
describe('CompareFields', () => { 
  test('should return undefined on succeeds', () => {
    const sut = makeSut()
    const response = sut.validation(makeFakeRequest())
    expect(response).toBeFalsy()
  })

  test('should return  on succeeds', () => {
    const sut = makeSut()
    const response = sut.validation(makeFakeRequest('random_value'))
    expect(response).toEqual(new InvalidParamsError('fieldToCompare'))
  })
})