import {HashDriverContract} from '@ioc:Adonis/Core/Hash'
import * as h from "@phc/pbkdf2";


export class MyHashDriver implements HashDriverContract {
  public async make(value: string) {
    return await h.hash(value);
  }

  public async verify(hashedValue: string, plainValue: string) {
    return await h.verify(hashedValue, plainValue);
  }
}
