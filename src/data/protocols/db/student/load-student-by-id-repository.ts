import { StudentModel } from '../../../../domain/models/student';

export interface LoadStudentByIdRepository {
  loadById: (id: string) => Promise<StudentModel | null>
}