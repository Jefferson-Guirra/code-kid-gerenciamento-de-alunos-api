import { StudentModel } from '../../../../domain/models/student';

export interface LoadStudentByNameRepository {
  loadByName: (name: string) => Promise<StudentModel | null>
}