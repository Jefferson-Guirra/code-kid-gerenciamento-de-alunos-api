export class ServerError extends Error {
  constructor(stack?: string) {
    super('Internal Server Error')
    this.name = stack || 'internal server Error'
  }
}