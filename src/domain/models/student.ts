export interface Student {
  name: string,
  price: number,
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