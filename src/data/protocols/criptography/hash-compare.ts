export interface HashCompare {
  compare: (value: string, compareValue: string)=> Promise<boolean>
}