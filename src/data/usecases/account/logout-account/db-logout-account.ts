import { AccountLogout } from '../../../../domain/usecases/account/logout-account';
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';

export class DbLogoutAccount implements AccountLogout {
  constructor( private readonly loadAccount: LoadAccountByAccessTokenRepository) {}
  async logout(accessToken: string):  Promise<string | undefined> {
    await this.loadAccount.loadByAccessToken(accessToken)
     return await Promise.resolve(undefined)
  }
}