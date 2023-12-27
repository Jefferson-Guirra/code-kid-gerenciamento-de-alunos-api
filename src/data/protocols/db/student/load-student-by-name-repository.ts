import { AddStudentModel } from '../../../../domain/usecases/student/add-student';

export interface LoadStudentByNameRepository {
  loadByName: (name: string) => Promise<AddStudentModel | null>
}