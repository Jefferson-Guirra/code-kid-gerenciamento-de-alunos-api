

export interface Finance {
  price: number,
  type: | 'energy' | 'water' | 'rent' | 'cleaning' | 'others' | 'employees'
  date: string
  month: string
  day: string
  year: string
}