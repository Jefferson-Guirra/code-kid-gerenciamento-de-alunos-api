import { AddStudentModel } from '../../../../domain/usecases/student/add-student';

export interface UpdateStudentByIdRepository {
  updateStudent: (id: string, updateFields: any) => Promise<AddStudentModel | null >
}