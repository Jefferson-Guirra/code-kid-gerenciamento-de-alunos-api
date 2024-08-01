import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/helpers/mongo-helper';
import { HttpRequest } from '../../presentation/protocols/http';
import app from '../config/app';


let studentsCollection: Collection

const makeFakeRequest = (): HttpRequest => ({
  body:{
    name: 'any_name',
    age: 0,
    father: 'any_father',
    mother: 'any_mother',
    phone: 0,
    course: ['any_course'],
    payment: 'yes',
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
    await studentsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 401 if account exist', async () => {
    const student = makeFakeRequest()
    await studentsCollection.insertOne({...student.body})
    await request(app).post('/api/add-student').send(student.body).expect(401)
  })

  test('should return 200 on succeeds', async () => {
    await request(app).post('/api/add-student').send(makeFakeRequest().body).expect(200)
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
    studentsCollection = await MongoHelper.getCollection('students')
    studentsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 401 if student not exist', async () => {
    await request(app).delete('/api/remove-student').send({id:'8905f4322dc6f594b58c42e0' }).expect(401)
  })

  test('should return 200 on success', async () => {
    const result = await studentsCollection.insertOne(makeFakeRequest().body)
    await request(app).delete('/api/remove-student').send({id: result.insertedId.toString()}).expect(200)


  })
})

describe('PUT /update/student', () => { 
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    studentsCollection = await MongoHelper.getCollection('students')
    studentsCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return 401 if student not exist', async () => {
    const body = await request(app).put('/api/update-student').send({ id: '663039d3ed41894a2fbdbae2', phone: 12345}).expect(401)
  })

  test('should return 200 on success', async () => {
    const { insertedId } = await studentsCollection.insertOne(makeFakeRequest().body)
    await request(app).put('/api/update-student').send({ id: insertedId.toString(), phone: 12345}).expect(200)

  })
})


describe('Get /payment-students', () => { 
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    studentsCollection = await MongoHelper.getCollection('students')
    await studentsCollection.deleteMany({})
  })
  afterAll(async() => {
    await MongoHelper.disconnect()

  })

  test('should return 200 on success', async () => { 
    await studentsCollection.insertOne(makeFakeRequest().body)
    await request(app).post('/api/get-payment-students').send({ payment: 'yes'}).expect(200)
  })

  test('should return 400 in badRequest', async () => { 
    await studentsCollection.insertOne(makeFakeRequest().body)
    await request(app).post('/api/get-payment-students').send({ id: 'any_id'}).expect(400)
  })
})