export interface ValidateAddAccountKeyRepository {
  validateAddKey: (key: string) => Promise<boolean>

}