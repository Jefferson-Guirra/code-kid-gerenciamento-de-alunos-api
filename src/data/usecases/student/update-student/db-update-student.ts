import { AddStudentModel } from '../../../../domain/usecases/student/add-student';
import { UpdateStudent } from '../../../../domain/usecases/student/update-student';
import { UpdateStudentByIdRepository } from '../../../protocols/db/student/update-student-by-id-repository';

export class DbUpdateStudent implements UpdateStudent {
  constructor( private readonly updateStudentByIdRepository: UpdateStudentByIdRepository) {}
  async update (id: string, updateFields: any): Promise<AddStudentModel | null> {
    return await this.updateStudentByIdRepository.updateStudent(id, updateFields)
  }
}