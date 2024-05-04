import { CheckRequestValidator } from '../../../../presentation/helpers/validators/check-request-validator';
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
  return new ValidatorComposite(validators)
}