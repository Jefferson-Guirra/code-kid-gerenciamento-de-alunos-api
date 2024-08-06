export interface RemoveStudent {
  remove: (accessToken: string ,id: string) => Promise<'removed' | null>
}