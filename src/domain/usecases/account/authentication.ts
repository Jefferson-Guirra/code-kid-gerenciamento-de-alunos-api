export interface AuthenticationModel {
  accessToken: string,
  username: string,
  email: string
}

export interface Authentication {
  auth: (email: string, password: string) => Promise<AuthenticationModel | null >
}