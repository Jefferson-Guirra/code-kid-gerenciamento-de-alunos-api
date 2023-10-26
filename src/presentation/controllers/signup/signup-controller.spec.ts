import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/account/add-account'
import { MissingParamsError } from '../../errors/missing-params-error'
import { badRequest, serverError, unauthorized } from '../../helpers/http/http'
import { HttpRequest } from '../../protocols/http'
import { Validation } from '../../protocols/validation'
import { SignUpController } from './signup-controller'

const makeFakeAddAccount = (): AddAccountModel => ({
  username: 'any_username',
  email: 'any_username',
  password: 'string',
  passwordConfirmation: 'any_password',
  privateKey: 'any_key',
  units: ['any_units']

})

const makeFakeAccount = (): AccountModel => ({
  username: 'any_username',
  email: 'any_username',
  password: 'string',
  id: 'string',
  units: ['any_unit']

})
const makeFakeRequest = (): HttpRequest => ({
  body: makeFakeAddAccount()
})

const makeFakeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())

    }
  }
  return new AddAccountStub()
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validation (httpRequest: HttpRequest):  Error | undefined {
      return undefined
    } 
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  validationStub: Validation,
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addAccountStub = makeFakeAddAccountStub()
  const sut = new SignUpController(validationStub, addAccountStub)

  return {
    sut,
    addAccountStub,
    validationStub,
  }
}

describe('SignUpController', () => { 

  test('should call validation with correct values', async () => { 
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validation')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest())
   })

   test('should return 400 if validation return error', async () => { 
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validation').mockReturnValueOnce(new MissingParamsError('any_field'))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamsError('any_field')))
   })

   test('should call addAccount with correct values', async () => { 
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddAccount())
   })

   test('should return 401 if addAccount return null', async () => { 
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
   })

   test('should return 500 if addAccount fails', async () => { 
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.reject(new Error('')))
    const response = await sut.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error('')))
   })
})