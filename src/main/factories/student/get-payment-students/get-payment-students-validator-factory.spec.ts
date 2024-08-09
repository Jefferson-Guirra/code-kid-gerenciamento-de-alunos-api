import { CheckRequestValidator } from '../../../../presentation/helpers/validators/check-request-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeGetStudentPaymentValidator } from './get-payment-students-validator-factory';

jest.mock('../../../../presentation/helpers/validators/validator-composite')


describe('ValidatorComposite', () => { 
  test('should call ValidatorComposite with correct values', () => { 
    const validators: Validation[] = []
    validators.push(
    new RequiredFieldsValidator('payment'),
    new RequiredFieldsValidator('accessToken'),
    new CheckRequestValidator(['payment', 'accessToken']))
    makeGetStudentPaymentValidator()
    expect(ValidatorComposite).toHaveBeenCalledWith(validators)
  })
})