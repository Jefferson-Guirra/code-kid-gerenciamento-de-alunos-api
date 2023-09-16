import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SecurityKeysMongoRepository } from './security-keys-mongo-repository'
import { HashCompare } from '../../../data/protocols/criptography/hash-compare'

const makeHashCompareStub = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare(value: string, compareValue: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashCompareStub()
}

interface SutTypes {
  sut: SecurityKeysMongoRepository
  hashCompareStub: HashCompare
}
const makeSut = (): SutTypes => {
  const hashCompareStub = makeHashCompareStub()
  const sut =  new SecurityKeysMongoRepository(hashCompareStub)
  return  {
    sut,
    hashCompareStub
  }
}
let keysCollection: Collection

const  addKey = async (key: string) => {
  const keysCollection = await MongoHelper.getCollection('security-keys')
  const result = await keysCollection.insertOne({ 
    name: 'codigo-kid-campo-formoso',
    createAccountKey: key
  })
  return await keysCollection.findOne({ _id: result.insertedId})

}
describe('SecurityKeysMongoRepository', () => { 
  beforeAll( async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  beforeEach(async () => {
    keysCollection = await MongoHelper.getCollection('security-keys')
    keysCollection.deleteMany({})
  })
  afterAll(async ()  => {
    await MongoHelper.disconnect()
  })
  test('should call hashCompare with correct values', async () => { 
    const { sut, hashCompareStub } = makeSut()
    await addKey('any_key')
    const hashSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.validateAddKey('any_key')
    expect(hashSpy).toHaveBeenCalledWith('any_key', 'any_key')
    
  })
})