export class InvalidParamsError extends Error {
  constructor(paramName: string ) {
    super(`Invalid param: ${paramName}`)
    this.name = 'Invalid params error'
  }
}