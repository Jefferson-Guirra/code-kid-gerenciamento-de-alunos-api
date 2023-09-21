import  request from 'supertest'
import bcrypt from 'bcrypt'
import { AddAccountModel } from '../../domain/usecases/add-account'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/helpers/mongo-helper'
import { Collection } from 'mongodb'

let keysCollection: Collection
let accountsCollection: Collection

const dbInsertKey = async () => {
  const key = await bcrypt.hash('any_key', 12)
  await keysCollection.insertOne({ name: 'codigo-kid-campo-formoso', createAccountKey: key})
}

const dbInsertAccount= async () => {
  await accountsCollection.insertOne({
    username: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password',
    privateKey: 'any_key'
  })
}



const fakeAddAccount = (): AddAccountModel => {
  const account = { 
  username: 'any_username',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password',
  privateKey: 'any_key',
  units: [ 'any_units']
  }
  return account
}
describe('POST /signup', () => { 
  beforeAll( async () =>  {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach( async () => {
    keysCollection = await MongoHelper.getCollection('security-keys')
    accountsCollection = await MongoHelper.getCollection('accounts')
    accountsCollection.deleteMany({})
    keysCollection.deleteMany({})
  })
  afterAll(async () => {
   await MongoHelper.disconnect()
  })
  test('should return 400 if account exist', async () => { 
    await dbInsertAccount()
    await dbInsertKey()
    const account = fakeAddAccount()
    await request(app).post('/api/signup').send(account).expect(401)
   })
  test('should return 200 on succeeds', async () => { 
    await dbInsertKey()
    const account = fakeAddAccount()
    await request(app).post('/api/signup').send(account).expect(200)
  })
})