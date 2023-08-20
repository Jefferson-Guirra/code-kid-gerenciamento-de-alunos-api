export class MissingParamsError extends Error {
  constructor(field: string) {
    super(`missing params Error ${field}`)
    this.name = 'missing params error'
  }
}