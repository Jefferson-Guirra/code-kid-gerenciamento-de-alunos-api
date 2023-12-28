import { AddStudentRepository } from '../../../data/protocols/db/student/add-student-repository';
import { LoadStudentByNameRepository } from '../../../data/protocols/db/student/load-student-by-name-repository';
import { Student } from '../../../domain/models/student';
import { AddStudentModel } from '../../../domain/usecases/student/add-student';
import { MongoHelper } from '../helpers/mongo-helper';

export class StudentMongoRepository implements 
AddStudentRepository,
LoadStudentByNameRepository {
  async add(student: Student): Promise<AddStudentModel | null> {
    const studentCollections = await MongoHelper.getCollection('students')
    const result = await studentCollections.insertOne(student)
    const findStudent = await studentCollections.findOne({ _id: result.insertedId})
    return findStudent && MongoHelper.Map(findStudent)
  }

  async loadByName(name: string): Promise<AddStudentModel | null> {
    const studentsCollection = await MongoHelper.getCollection('students')
    const student = await studentsCollection.findOne({ name })
    return student && MongoHelper.Map(student)

  }


}