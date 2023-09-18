import { HashCompare } from '../../../data/protocols/criptography/hash-compare';
import { Hasher } from '../../../data/protocols/criptography/hasher';
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor(  private readonly salt: number ) {}
  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
  async compare(value: string, compareValue: string): Promise<boolean> {
    return await  bcrypt.compare(value, compareValue)
  }
}