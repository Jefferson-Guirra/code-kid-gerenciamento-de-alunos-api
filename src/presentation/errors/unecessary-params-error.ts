export class UnnecessaryParamsError extends Error {
  constructor ( field: string) {
    super(`Unnecessary (${field}) fields`)
    this.name = 'Unnecessary params Error'

  }
}