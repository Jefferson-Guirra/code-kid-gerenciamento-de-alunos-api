import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountMongoRepository } from './account-mongo-repository'

let accountsCollection: Collection

const makeFakeAddAccount = (): AddAccountModel => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password',
  privateKey: 'any_key',
})

const makeSut = (): AccountMongoRepository =>  new AccountMongoRepository()
describe('AccountMongoRepository', () => { 
  beforeAll(async () =>   {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })
 afterAll(async () => {
  await MongoHelper.disconnect()
 })

 test('should return account if addAccount success', async () => { 
  const sut = makeSut()
  let count = await accountsCollection.countDocuments()
  expect(count).toBe(0)
  const account = await sut.addAccount(makeFakeAddAccount())
  count = await accountsCollection.countDocuments()
  expect(count).toBe(1)
  expect(account?.email).toEqual('any_email@mail.com')
  expect(account?.username).toEqual('any_username')
  expect(account?.password).toEqual('any_password')
  expect(account?.id).toBeTruthy()
  })
})