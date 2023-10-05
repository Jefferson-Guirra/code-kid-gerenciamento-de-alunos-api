import { AccountLogout } from '../../../../domain/usecases/account/logout-account';
import { LoadAccountByAccessTokenRepository } from '../../../protocols/db/account/load-account-by-access-token-repository';
import { RemoveAccessTokenRepository } from '../../../protocols/db/account/remove-access-token-repository';

export class DbLogoutAccount implements AccountLogout {
  constructor( 
    private readonly loadAccount: LoadAccountByAccessTokenRepository,
    private readonly logoutAccount: RemoveAccessTokenRepository
  ) {}
  async logout(accessToken: string):  Promise<string | undefined> {
      const account = await this.loadAccount.loadByAccessToken(accessToken)
      if( !account ) {
        return undefined
      }
      await this.logoutAccount.removeAccessToken(accessToken)
      return 'success'
  }
}