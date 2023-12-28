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
    await studentsCollection.insertOne(student.body)
    await request(app).post('/api/add-student').send(student.body).expect(401)
  })
})