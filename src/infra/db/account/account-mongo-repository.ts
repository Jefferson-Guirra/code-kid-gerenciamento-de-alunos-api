import { AddAccountRepository } from '../../../data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/account/load-account-by-email-repository';
import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements 
AddAccountRepository,
LoadAccountByEmailRepository {
  async addAccount(account: AddAccountModel): Promise<AccountModel | null>{
    const {passwordConfirmation,privateKey, ...rest} = account
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne({...rest})
    const findAccount = await accountsCollection.findOne({_id: result.insertedId})
    return findAccount  && MongoHelper.Map(findAccount)
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })
    return account && MongoHelper.Map(account)
  }
}