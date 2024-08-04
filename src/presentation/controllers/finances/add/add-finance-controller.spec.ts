import { Finance } from '../../../../domain/models/finance';
import { AddFinance, AddFinanceModel } from '../../../../domain/usecases/finance/add-finance';
import { HttpRequest } from '../../../protocols/http';
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
    addFinance (finance: Finance): AddFinanceModel {
      return {...makeFakeFinance(), id: 'any_id'}

    }
  }

  return new AddFinanceStub()
} 

interface SutTypes {
  addFinanceStub: AddFinance
  sut: AddFinanceController
}

const makeSut = (): SutTypes => {
  const addFinanceStub = makeAddFinanceStub()
  const sut = new AddFinanceController(addFinanceStub)

  return {
    addFinanceStub, 
    sut
  }
} 

describe('AddFinanceController', () => { 
  
  test('should call AddFinance with correct values', async () => { 
    const { sut, addFinanceStub } = makeSut()
    const addSpy = jest.spyOn(addFinanceStub, 'addFinance')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeFinance())
  })

 })