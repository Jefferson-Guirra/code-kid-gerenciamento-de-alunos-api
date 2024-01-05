import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter';

export const makeAddStudentValidatorFactory = (): Validation => {
  const validators: Validation[] = []
  for(const field of [
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
  ]){
    validators.push(new RequiredFieldsValidator(field))
  }
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}