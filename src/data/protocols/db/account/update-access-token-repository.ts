
export interface UpdateAccessTokenRepository {
  update: (id: string, token: string) => Promise<string| null>
}