import { AddStudentModel } from './add-student'

export interface UpdateStudent {
  update: (id: string, updateFields: any) => Promise<AddStudentModel | null>
}