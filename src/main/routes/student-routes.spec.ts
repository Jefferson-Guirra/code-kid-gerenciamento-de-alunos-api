import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/helpers/mongo-helper';
import { HttpRequest } from '../../presentation/protocols/http';
import app from '../config/app';


let studentsCollection: Collection
let accountsCollection: Collection

const dbInsertAccount= async () => {
  return await accountsCollection.insertOne({
    username: 'any_username',
    email: 'any_email@mail.com',
    password: 'any_password',
    privateKey: 'any_key',
    accessToken: 'any_token'
  })
}

const makeFakeRequest = (payment: | 'yes' | 'not' ): HttpRequest => ({
  body:{
    name: 'any_name',
    age: 0,
    father: 'any_father',
    mother: 'any_mother',
    phone: 0,
    course: ['any_course'],
    payment,
    email: 'any_email@mail.com',
    registration: 'active',
    date_payment: ['any_date']
  }
})


describe('POST /add-student', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    studentsCollection = await MongoHelper.getCollection('students')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await studentsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 401 if account exist', async () => {

    const student = makeFakeRequest('yes')
    await studentsCollection.insertOne({...student.body})
    await request(app).post('/api/add-student').send(student.body).expect(401)
  })

  test('should return 200 on succeeds', async () => {
    await dbInsertAccount()
    const fakeRequest = {accessToken: 'any_token', ...makeFakeRequest('yes').body}
    await request(app).post('/api/add-student').send(fakeRequest).expect(200)
  })

  test('should return 400 in bad request', async () => {
    await request(app).post('/api/add-student').send({
      name: 'any_name',
      age: 0,
      father: 'any_father',
      mother: 'any_mother',
      phone: 0,
      course: ['any_course'],
      payment: 'yes',
      registration: 'active',
    }).expect(400)
  })
})


describe('DELETE /remove-student', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    studentsCollection = await MongoHelper.getCollection('students')
    accountsCollection.deleteMany({})
    studentsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 401 if student not exist', async () => {

    await request(app).delete('/api/remove-student').send({accessToken: 'any_id', id:'8905f4322dc6f594b58c42e0' }).expect(401)
  })

  test('should return 200 on success', async () => {
    await dbInsertAccount()
    const result = await studentsCollection.insertOne(makeFakeRequest('yes').body)
    await request(app).delete('/api/remove-student').send({accessToken: 'any_token',id: result.insertedId.toString()}).expect(200)


  })
})

describe('PUT /update/student', () => { 
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    studentsCollection = await MongoHelper.getCollection('students')
    accountsCollection = await MongoHelper.getCollection('accounts') 
    accountsCollection.deleteMany({})
    studentsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 400 on badRequest', async () => {
    await request(app).put('/api/update-student').send({ id: '663039d3ed41894a2fbdbae2', phone: 12345}).expect(400)
  })
  test('should return 401 if authentication fails', async () => {
    await request(app).put('/api/update-student').send({ id: '663039d3ed41894a2fbdbae2', phone: 12345, accessToken: 'any_token'}).expect(401)
  })

  test('should return 200 on success', async () => {
    await dbInsertAccount()
    const { insertedId } = await studentsCollection.insertOne(makeFakeRequest('yes').body)
    await request(app).put('/api/update-student').send({ id: insertedId.toString(), phone: 12345, accessToken: 'any_token'}).expect(200)

  })
})


describe('Get /payment-students', () => { 
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    studentsCollection = await MongoHelper.getCollection('students')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await studentsCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })
  afterAll(async() => {
    await MongoHelper.disconnect()

  })

  test('should return 401 if authentication fails', async () => { 
    await studentsCollection.insertOne(makeFakeRequest('yes').body)
    await request(app).post('/api/get-payment-students').send({ payment: 'yes', accessToken: 'any_token'}).expect(401)
  })

  test('should return 400 in badRequest', async () => { 
    await studentsCollection.insertOne(makeFakeRequest('yes').body)
    await request(app).post('/api/get-payment-students').send({ id: 'any_id'}).expect(400)
  })

  test('should return 200 on succeeds', async () => { 
    await dbInsertAccount()
    await studentsCollection.insertOne(makeFakeRequest('yes').body)
    await studentsCollection.insertOne(makeFakeRequest('not').body)
    await request(app).post('/api/get-payment-students').send({ payment: false, accessToken: 'any_token'}).expect(200)

    
  })

})