import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { StudentMongoRepository } from './student-mongo-repository'
import { StudentModel } from '../../../domain/models/student'
import { AddStudentModelMongoRepository } from '../../../data/protocols/db/student/add-student-repository'

const makeFakeRequest = (): AddStudentModelMongoRepository => ({
  name: 'any_name',
  price: 0,
  age: 0,
  father: 'any_father',
  mother: 'any_mother',
  phone: 0,
  course: ['any_course'],
  payment: 'yes',
  registration: 'active',
  email: 'any_email@mail.com',
  date_payment: ['any_date']
})



const makeAddIdsStudents = (id: ObjectId, payment?: string): StudentModel => ({
  name: 'any_name',
  price: 0,
  age: 0,
  father: 'any_father',
  id: id.toString(),
  mother: 'any_mother',
  phone: 0,
  course: ['any_course'],
  payment: payment ? payment : 'undefined',
  registration: 'active',
  email: 'any_email@mail.com',
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

  test('should return null if loadStudent fails', async () => {
    const sut = makeSut()
    const response = await sut.loadByName('any_name')
    expect(response).toBeFalsy()
  })

  test('should return student if loadStudentById success', async () => {
    const sut = makeSut()
    const result = await studentsCollection.insertOne(makeFakeRequest())
    const response = await sut.loadById(result.insertedId.toString())
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
  test('should return null if LoadStudentById return null', async () => {
    const sut = makeSut()
    const response = await sut.loadById('6591f4322dc6f594b58c42e0')
    expect(response).toBeFalsy()
  })

  test('should return removed message if removeStudent success', async() => {
    const sut = makeSut()
    let count = await studentsCollection.countDocuments()
    expect(count).toBe(0)
    const result = await studentsCollection.insertOne(makeFakeRequest())
    count = await studentsCollection.countDocuments()
    expect(count).toBe(1)
    const response = await sut.removeById(result.insertedId.toString())
    count = await studentsCollection.countDocuments()
    expect(count).toBe(0)
    expect(response).toEqual('removed')

  })

  test('should return null if updateStudent return null', async () => {
    const sut = makeSut()
    const updateStudent = await sut.updateStudent('663039d3ed41894a2fbdbae2',{phone: 1354})
    expect(updateStudent).toBeFalsy()
  })

  test('should return updated student on succeeds', async () => { 
    const sut = makeSut()
    const addStudent = await studentsCollection.insertOne(makeFakeRequest())
    const student = await sut.updateStudent(addStudent.insertedId.toString(), { name: 'random_name', phone:123456})
    expect(student?.name).toEqual('random_name')
    expect(student?.age).toBe(0)
    expect(student?.id).toBeTruthy()
    expect(student?.date_payment).toEqual(['any_date'])
    expect(student?.father).toEqual('any_father')
    expect(student?.mother).toEqual('any_mother')
    expect(student?.registration).toEqual('active')
    expect(student?.course).toEqual(['any_course'])
    expect(student?.phone).toEqual(123456)
  })

  test('should return payment students', async () => {
    const { insertedIds } = await studentsCollection.insertMany([makeFakeRequest(), makeFakeRequest()])
    const sut = makeSut()
    const studentsArray = [{...makeAddIdsStudents( insertedIds[0], 'yes') },{...makeAddIdsStudents(insertedIds[1], 'yes')} ]
    const response = await sut.getPaymentStudents('yes')
    expect(response).toHaveLength(studentsArray.length)
    expect(response).toEqual(studentsArray)
  })

  test('should return debtors students', async () => {
    const { insertedIds : id } = await studentsCollection.insertMany([makeFakeRequest(), {...makeFakeRequest(), payment: 'not'} ])
    const sut = makeSut()
    const studentsArray = [ {...makeAddIdsStudents(id[1], 'not')} ]
    const response = await sut.getPaymentStudents('not')
    expect(response).toEqual(studentsArray)
  })

  test('should return null if getPaymentStudents fails', async () => {
    await studentsCollection.insertMany([makeFakeRequest(), {...makeFakeRequest(), payment: 'not'} ])
    const sut = makeSut()
    const response = await sut.getPaymentStudents('no')
    expect(response).toEqual([])
  })

  test('should return all students if  call getPaymentStudents with undefined value', async () => {
    const { insertedIds : id } = await studentsCollection.insertMany([makeFakeRequest(), {...makeFakeRequest(), payment: 'not'} ])
    const studentsArray = [ {...makeAddIdsStudents(id[0], 'yes')}, { ...makeAddIdsStudents(id[1], 'not')}]
    const sut = makeSut()
    const response = await sut.getPaymentStudents()
    expect(response).toEqual( studentsArray )
  })
})