import { AddStudentModel } from '../../../../domain/usecases/student/add-student';

export interface LoadStudentByName {
  loadByName: (name: string) => Promise<AddStudentModel | null>
}