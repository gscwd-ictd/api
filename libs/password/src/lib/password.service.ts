import { Inject, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { Argon2Options, PASSWORD_SERVICE, ErrorResult, PASSWORD_UNDEFINED, INVALID_HASH } from '../types';

@Injectable()
export class PasswordService {
  private argon2Options: Argon2Options;

  constructor(
    @Inject(PASSWORD_SERVICE)
    private readonly options: Argon2Options
  ) {
    this.argon2Options = options;
  }

  async hash(inputPw: string, errorCallback: (error: Error) => ErrorResult) {
    try {
      // hash to provided password
      return await hash(inputPw, { ...this.argon2Options, raw: false });

      // catch the error
    } catch (error) {
      // check if error result is not supplied, then throw a generic error
      if (!errorCallback) throw new Error(error);

      // throw error result
      throw errorCallback(PASSWORD_UNDEFINED);
    }
  }

  async verify(hashedPw: string, inputPw: string, errorCallback: (error: Error) => ErrorResult) {
    try {
      // verify the password
      const isValid = await verify(hashedPw, inputPw, { ...this.argon2Options, raw: false });

      // throw error if hash is not valid
      if (!isValid) throw errorCallback(INVALID_HASH);

      // return the hash value if valid
      return isValid;

      // catch the error
    } catch (error) {
      // check if error result is not supplied, then throw a generic error
      if (!errorCallback) throw new Error(error);

      // check if error name is InvalidInput to throw a more suitable error message
      if (error.name === 'InvalidInput') throw errorCallback(INVALID_HASH);

      // throw error result
      throw errorCallback(error);
    }
  }
}
