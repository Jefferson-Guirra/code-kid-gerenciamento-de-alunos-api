export interface RemoveStudentByIdRepository {
  removeById:(id: string) => Promise<string>
}