import { StudentModel } from '../../../../domain/models/student';

export interface UpdateStudentByIdRepository {
  updateStudent: (id: string, updateFields: any) => Promise<StudentModel | null >
}