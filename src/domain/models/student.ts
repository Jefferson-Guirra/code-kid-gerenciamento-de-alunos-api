export interface Student {
  name: string,
  age: number,
  father: string
  mother:string,
  phone: number,
  course: string[],
  payment: string,
  date_payment: string[],
  email: string,
  registration: | 'active' | 'suspense' | 'inactive'
}