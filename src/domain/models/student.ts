export interface StudentModel {
  id: string
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