import { ModuleMetadata, FactoryProvider, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

/**
 *  For more information about argon2, visit their official github repository
 *  https://github.com/P-H-C/phc-winner-argon2
 */
export type Argon2Options = {
  // the length of the generated hash
  hashLength?: number;

  // defines the amount of computation realized and therefore the execution time, given in number
  timeCost?: number;

  //  which defines the memory usage, given in kibibytes
  memoryCost?: number;

  // defines the number of parallel threads
  parallelism?: number;

  // the type of argon hashing
  type?: 0 | 1 | 2;

  // Argon2 version (defaults to the most recent version, currently 13)
  version?: number;

  // The salt to use, at least 8 characters
  salt?: Buffer;

  // the length of the salt, at least 8 characters
  saltLength?: number;

  // defines whether the resulting hash is in a form of buffer (true) or string (false)
  raw?: boolean;

  // used for keyed hashing. This allows a secret key to be input at hashing time (from some external location)
  // and be folded into the value of the hash. This means that even if your salts and hashes are compromised,
  // an attacker cannot brute-force to find the password without the key.
  secret?: Buffer;

  associatedData?: Buffer;
};

// argon2 with async options
export type Argon2AsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<Argon2Options>, 'useFactory' | 'inject'>;

// error result type
export type ErrorResult = HttpException | RpcException;

// provider name
export const PASSWORD_SERVICE = 'PASSWORD_SERVICE';

// error message if hash is not valid
export const INVALID_HASH = { status: 400, message: 'Invalid hash', name: 'InvalidInput' };

// error message if password field is undefined
export const PASSWORD_UNDEFINED = { status: 400, message: 'Undefined field', name: 'UndefinedInput' };
