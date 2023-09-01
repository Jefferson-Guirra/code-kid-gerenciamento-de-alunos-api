import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';

export interface AddAccountRepository {
  addAccount: (account: AddAccountModel) => Promise<AccountModel | null>
}