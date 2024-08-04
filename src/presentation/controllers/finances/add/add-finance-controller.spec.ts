import { Finance } from '../../../../domain/models/finance';
import { AddFinance, AddFinanceModel } from '../../../../domain/usecases/finance/add-finance';
import { MissingParamsError } from '../../../errors/missing-params-error';
import { badRequest } from '../../../helpers/http/http';
import { HttpRequest } from '../../../protocols/http';
import { Validation } from '../../../protocols/validation';
import { AddFinanceController } from './add-finance-controller';

const makeFakeFinance = (): Finance => ({
  price: 0,
  type: 'others',
  date:'any_date',
  day: 'any_day',
  month: 'any_month',
  year: 'any_year'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {...makeFakeFinance()}
})
const makeAddFinanceStub = (): AddFinance => {
  class AddFinanceStub implements AddFinance {
    async addFinance (finance: Finance): Promise<AddFinanceModel | null> {
      return await Promise.resolve({...makeFakeFinance(), id: 'any_id'})

    }
  }

  return new AddFinanceStub()
} 

const makeValidatorStub = (): Validation => {
  class ValidatorStub implements Validation {
    validation (httpRequest: HttpRequest): Error | undefined {
      return undefined

    }
  }
  return new ValidatorStub()
}

interface SutTypes {
  validationStub: Validation
  addFinanceStub: AddFinance
  sut: AddFinanceController
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidatorStub()
  const addFinanceStub = makeAddFinanceStub()
  const sut = new AddFinanceController(validationStub,addFinanceStub)

  return {
    sut,
    validationStub,
    addFinanceStub
  }
} 

describe('AddFinanceController', () => { 

  test('should call AddFinance with correct values', async () => { 
    const { sut, addFinanceStub } = makeSut()
    const addSpy = jest.spyOn(addFinanceStub, 'addFinance')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeFinance())
  })

  test('should call Validator with correct values', async () => { 
    const { sut, validationStub } = makeSut()
    const validatorSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validatorSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validation').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')))
  })

 })