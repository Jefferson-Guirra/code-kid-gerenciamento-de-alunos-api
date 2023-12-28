import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { StudentMongoRepository } from './student-mongo-repository'
import { Student } from '../../../domain/models/student'

const makeFakeRequest = (): Student => ({
  name: 'any_name',
  age: 0,
  father: 'any_father',
  mother: 'any_mother',
  phone: 0,
  course: ['any_course'],
  payment: 'yes',
  registration: 'active',
  date_payment: ['any_date']
})

let studentsCollection: Collection
const makeSut = () => new StudentMongoRepository()
describe('StudentMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    studentsCollection = await MongoHelper.getCollection('students')
    await studentsCollection.deleteMany({})
  })

  afterAll(async () =>{
    await MongoHelper.disconnect()
  })

  test('should return student if add succeeds ', async () => {
    const sut = makeSut()
    let count = await studentsCollection.countDocuments()
    expect(count).toBe(0)
    const student = await sut.add(makeFakeRequest())
    count = await studentsCollection.countDocuments()
    expect(count).toBe(1)
    expect(student?.name).toEqual('any_name')
    expect(student?.age).toBe(0)
    expect(student?.id).toBeTruthy()
    expect(student?.date_payment).toEqual(['any_date'])
    expect(student?.father).toEqual('any_father')
    expect(student?.mother).toEqual('any_mother')
    expect(student?.registration).toEqual('active')
    expect(student?.course).toEqual(['any_course'])
    expect(student?.name).toEqual('any_name')
    expect(student?.phone).toEqual(0)
  })

  test('should return student if loadStudent success', async () => {
    const sut = makeSut()
    await studentsCollection.insertOne(makeFakeRequest())
    const response = await sut.loadByName('any_name')
    expect(response?.name).toEqual('any_name')
    expect(response?.age).toBe(0)
    expect(response?.id).toBeTruthy()
    expect(response?.date_payment).toEqual(['any_date'])
    expect(response?.father).toEqual('any_father')
    expect(response?.mother).toEqual('any_mother')
    expect(response?.registration).toEqual('active')
    expect(response?.course).toEqual(['any_course'])
    expect(response?.name).toEqual('any_name')
    expect(response?.phone).toEqual(0)
  })
})