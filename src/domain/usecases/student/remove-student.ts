export interface RemoveStudent {
  remove: (id: string) => Promise<'removed' | null>
}