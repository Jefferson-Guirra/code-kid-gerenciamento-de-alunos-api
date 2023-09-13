import { InvalidParamsError } from '../../errors/invalid-params-error'
import { EmailValidator } from '../../protocols/email-validator'
import { HttpRequest } from '../../protocols/http'
import { EmailValidation } from './email-validator'

const makeFakeRequest = (): HttpRequest =>  ({
  body: {
    username: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(value: string):  boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
interface SutTypes {
  emailValidatorStub: EmailValidator,
  sut: EmailValidation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}
describe('EmailValidation', () => { 
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const validatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validation(makeFakeRequest())
    expect(validatorSpy).toBeCalledWith('any_email@mail.com')
  })

  test('should return invalidParams error if EmailValidator return false', () => { 
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const response = sut.validation(makeFakeRequest())
    expect(response).toEqual(new InvalidParamsError('email'))
   })

   test('should return throw if EmailValidator fails', () => { 
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error('')})
    expect(sut.validation).toThrow()
   })

})