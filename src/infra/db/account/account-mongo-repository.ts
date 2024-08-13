import { ObjectId } from 'mongodb';
import { AddAccountRepository } from '../../../data/protocols/db/account/add-account-repository';
import { AccountLoginModel, LoadAccountByAccessTokenRepository } from '../../../data/protocols/db/account/load-account-by-access-token-repository';
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository';
import { RemoveAccessTokenRepository } from '../../../data/protocols/db/account/remove-access-token-repository';
import { UpdateAccessTokenRepository } from '../../../data/protocols/db/account/update-access-token-repository';
import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/usecases/account/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements 
AddAccountRepository,
LoadAccountByEmailRepository,
RemoveAccessTokenRepository,
LoadAccountByAccessTokenRepository,
UpdateAccessTokenRepository {
  async addAccount(account: AddAccountModel): Promise<AccountModel | null>{
    const {passwordConfirmation,privateKey, ...rest} = account
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne({...rest})
    const findAccount = await accountsCollection.findOne({_id: result.insertedId})
    return findAccount  && MongoHelper.Map(findAccount)
  }

  async update (id: string, token: string): Promise<string | null> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOneAndUpdate({ _id: new ObjectId(id)},
      { $set: {
        accessToken: token
      }},
      {
        returnDocument: 'after'
      }
    )
    return account.value && account.value.accessToken 
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })
    return account && MongoHelper.Map(account)
  }

  async removeAccessToken(accessToken: string): Promise<void> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ accessToken }, {
      $unset: {
        accessToken: ''
      }
    })
  }

  async loadByAccessToken (accessToken: string): Promise<AccountLoginModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({accessToken})
    return account && MongoHelper.Map(account)
  }
}