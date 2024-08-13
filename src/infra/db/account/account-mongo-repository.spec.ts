import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountModel } from '../../../domain/usecases/account/add-account'
import { AccountMongoRepository } from './account-mongo-repository'

let accountsCollection: Collection

const makeFakeAddAccount = (): AddAccountModel => ({
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password',
  privateKey: 'any_key',
  units: ['any_unity']
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

  test('should return accessToken if update success', async () => { 
    const sut = makeSut()
    const addAccount = await accountsCollection.insertOne(makeFakeAddAccount())
    const response = await sut.update(addAccount.insertedId.toString(), 'any_token')
    expect(response).toEqual('any_token')
  })

  test('should return account if loadAccount success', async () => {
    const {privateKey, passwordConfirmation,...rest} = makeFakeAddAccount()
    await accountsCollection.insertOne({...rest})
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account?.email).toEqual('any_email@mail.com')
    expect(account?.username).toEqual('any_username')
    expect(account?.password).toEqual('any_password')
    expect(account?.id).toBeTruthy()
  })

  test('should return null if loadAccount fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('should remove accessToken if removeAccessToken success', async () => {
    const sut = makeSut()
    const result  = await accountsCollection.insertOne({
      username: 'any_username',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
      privateKey: 'any_key',
      units: [ 'any_unity'],
      accessToken: 'any_token'
    })
    let account: any = await accountsCollection.findOne({_id: result.insertedId})
    expect(account.accessToken).toBe('any_token')
    await sut.removeAccessToken('any_token')
    account = await accountsCollection.findOne({_id: result.insertedId})
    expect(account.accessToken).toBeFalsy()
    expect(account?.email).toEqual('any_email@mail.com')
    expect(account?.username).toEqual('any_username')
    expect(account?.password).toEqual('any_password')
    expect(account?._id).toBeTruthy()
  })

  test('should return account if LoadAccountByAccessToken success', async () => {
    const sut = makeSut()
    const { privateKey, passwordConfirmation, ...rest} = makeFakeAddAccount()
    await accountsCollection.insertOne({...rest, accessToken: 'any_token'})
    const account = await sut.loadByAccessToken('any_token')
    expect(account?.accessToken).toEqual('any_token')
    expect(account?.email).toEqual('any_email@mail.com')
    expect(account?.username).toEqual('any_username')
    expect(account?.password).toEqual('any_password')
    expect(account?.id).toBeTruthy()
    expect(account?.units).toEqual(['any_unity'])
  })

  test('should return null if LoadAccountByAccessToken return null', async () => {
    const sut = makeSut()
    const account = await sut.loadByAccessToken('any_token')
    expect(account).toBeFalsy()
  })
})