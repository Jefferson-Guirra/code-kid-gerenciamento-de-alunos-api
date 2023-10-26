import { AccountModel } from '../../../../domain/models/account';

export interface AccountLoginModel extends AccountModel {
  accessToken: string,
}

export interface LoadAccountByAccessTokenRepository {
  loadByAccessToken: (accessToken: string ) => Promise<AccountLoginModel | null>
}