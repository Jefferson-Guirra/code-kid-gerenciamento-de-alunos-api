export interface RemoveAccessTokenRepository {
  removeAccessToken: (accessToken: string )=> Promise<void>
}