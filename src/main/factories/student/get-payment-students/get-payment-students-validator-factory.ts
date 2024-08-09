import { CheckRequestValidator } from '../../../../presentation/helpers/validators/check-request-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';

export  const makeGetStudentPaymentValidator = (): Validation => {
  const validators: Validation[] = []
  validators.push(
  new RequiredFieldsValidator('payment'), 
  new RequiredFieldsValidator('accessToken'),
  new CheckRequestValidator(['payment', 'accessToken']))
  return new ValidatorComposite(validators)
}