import { CompareFieldsValidator } from '../../../../presentation/helpers/validators/compare-fields-validator';
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validator';
import { RequiredFieldsValidator } from '../../../../presentation/helpers/validators/required-fields-validator';
import { ValidatorComposite } from '../../../../presentation/helpers/validators/validator-composite';
import { Validation } from '../../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter';

export const makeSignupValidator = (): Validation => {
  const validators: Validation[] = []
  for( const field of ['username', 'email', 'password', 'passwordConfirmation', 'privateKey']) {
    validators.push( new RequiredFieldsValidator(field))
  } 
  validators.push(new CompareFieldsValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidatorComposite(validators)
}