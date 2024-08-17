import { StudentModel } from '../../models/student'

export interface UpdateStudent {
  update: (id: string, updateFields: any) => Promise<StudentModel | null>
}