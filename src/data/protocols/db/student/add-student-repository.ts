import { StudentModel } from '../../../../domain/models/student';

export type AddStudentModelMongoRepository = Omit<StudentModel, 'id'>

export interface AddStudentRepository {
  add: (student: AddStudentModelMongoRepository) => Promise<StudentModel | null>
}