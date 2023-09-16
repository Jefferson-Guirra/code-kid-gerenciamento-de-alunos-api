import { HashCompare } from '../../../data/protocols/criptography/hash-compare';
import { ValidateAddAccountKeyRepository } from '../../../data/protocols/db/keys/validate-add-account-key-repository';
import { MongoHelper } from '../helpers/mongo-helper';

export class SecurityKeysMongoRepository implements ValidateAddAccountKeyRepository{ 
  constructor( private readonly hashCompare: HashCompare) {}
   async validateAddKey(key: string): Promise<boolean> {
    const keysCollection = await MongoHelper.getCollection('security-keys')
    const keys: any = await keysCollection.findOne({ name: 'codigo-kid-campo-formoso'})
    return this.hashCompare.compare(key, keys.createAccountKey)
   }
}