/* eslint-disable no-prototype-builtins */
import { MissingParamsError } from '../../errors/missing-params-error'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { ValidatorComposite } from './validator-composite'

const makeFakeRequest = () => ({
  body: {
    field: 'any_field'
  }
})

const  makeValidatorStub = (): Validation => {
  class RequiredFieldsValidatorStub implements Validation {
    constructor(private readonly field: string) {}
    validation (httpRequest: HttpRequest): Error | undefined {
      if(!httpRequest.body.hasOwnProperty(this.field)) {
        return new MissingParamsError(this.field)
      }
    }
  }
  return new RequiredFieldsValidatorStub('field')
}

interface SutTypes {
  validatorsStub: Validation[],
  sut: ValidatorComposite
}

const makeSut = (): SutTypes => {
  const validatorsStub: Validation[] =  [makeValidatorStub(), makeValidatorStub()]
  const sut = new ValidatorComposite(validatorsStub)
  return {
    sut,
    validatorsStub
  }
}
describe('ValidatorComposite', () => { 
  
  test('should call validators with correct values', () => { 
    const { validatorsStub, sut} = makeSut()
    const validatorSpy = jest.spyOn(validatorsStub[0], 'validation')
    const secondValidatorSpy = jest.spyOn(validatorsStub[1], 'validation')
    sut.validation(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
    expect(secondValidatorSpy).toHaveBeenCalledWith(makeFakeRequest())
   })

})