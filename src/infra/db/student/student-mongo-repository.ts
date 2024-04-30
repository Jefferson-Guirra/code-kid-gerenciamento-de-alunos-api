import { ObjectId } from 'mongodb';
import { AddStudentRepository } from '../../../data/protocols/db/student/add-student-repository';
import { LoadStudentByIdRepository } from '../../../data/protocols/db/student/load-student-by-id-repository';
import { LoadStudentByNameRepository } from '../../../data/protocols/db/student/load-student-by-name-repository';
import { Student } from '../../../domain/models/student';
import { AddStudentModel } from '../../../domain/usecases/student/add-student';
import { MongoHelper } from '../helpers/mongo-helper';
import { RemoveStudentByIdRepository } from '../../../data/protocols/db/student/remove-student-by-id-repository';
import { UpdateStudentByIdRepository } from '../../../data/protocols/db/student/update-student-by-id-repository';

export class StudentMongoRepository implements 
AddStudentRepository,
LoadStudentByNameRepository,
LoadStudentByIdRepository,
RemoveStudentByIdRepository,
UpdateStudentByIdRepository {
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

  async loadById(id: string): Promise<AddStudentModel | null> {
    const convertedId = new ObjectId(id)
    const studentsCollection = await MongoHelper.getCollection('students')
    const student = await studentsCollection.findOne({_id: convertedId})
    return student && MongoHelper.Map(student)
  }

  async removeById (id: string): Promise<string> {
    const studentCollections = await MongoHelper.getCollection('students')
    const convertedId = new ObjectId(id)
    await studentCollections.deleteOne({_id: convertedId})
    return 'removed'
  }

  async updateStudent (id: string, updateFields: any):Promise<AddStudentModel | null> {
    const studentCollection = await MongoHelper.getCollection('students')
    const updatedStudent = await studentCollection.findOneAndUpdate(
      { _id: new ObjectId(id)}, 
      { $unset: updateFields}, 
      { returnDocument: 'after'}
    )
    return updatedStudent.value && MongoHelper.Map(updatedStudent.value)
  }


}