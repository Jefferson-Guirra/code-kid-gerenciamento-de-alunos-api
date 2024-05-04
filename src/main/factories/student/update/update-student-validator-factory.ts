import { CheckRequestValidator } from '../../../../presentation/helpers/validators/check-request-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';

export const makeValidatorUpdateStudentFactory = (): Validation => {
  const validators: Validation [] = []
  validators.push(new CheckRequestValidator([
    'registration',
    'name',
    'age',
    'father',
    'mother',
    'phone',
    'course',
    'payment',
    'date_payment',
    'email'
  ]))
  validators.push(new RequiredFieldsValidator('id'))
  return new ValidatorComposite(validators)
}