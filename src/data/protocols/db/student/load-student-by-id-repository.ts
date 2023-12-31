import { AddStudentModel } from '../../../../domain/usecases/student/add-student';

export interface LoadStudentByIdRepository {
  loadById: (id: string) => Promise<AddStudentModel | null>
}