import { Injectable } from '@nestjs/common';
import { PasswordService } from '@gscwd-api/password';
import { DataSource } from 'typeorm';
import { Credentials, RegistrationDetails, rpcError } from '@gscwd-api/utils';
import { Employee } from '../../employee';
import { User, UserService } from '../../user';
import { EMAIL_ALREADY_EXISTS, FAILED_TO_CREATE_USER } from '../errors/auth.errors';
import { RpcException } from '@nestjs/microservices';
import { MyRpcException } from '@gscwd-api/microservices';

@Injectable()
export class AuthenticationService {
  constructor(
    // inject password service
    private readonly passwordService: PasswordService,

    // inject data source
    private readonly datasource: DataSource,

    // inject user service
    private readonly userService: UserService
  ) {}

  async createUser(data: RegistrationDetails) {
    // deconstruct registration data
    const { credentials, details } = data;

    // create a hash of the user's password before storing it in the database
    const password = await this.passwordService.hash(credentials.password, (error) => rpcError(error));

    // insert into user and employee tables via transaction
    try {
      return await this.datasource.transaction(async (manager) => {
        // create a new user with the supplied credentials
        const user = await manager.save(User, { ...credentials, password });

        // create new employee with the supplied details
        const employee = await manager.save(Employee, { ...details, userId: user.userId });

        // return newly created user and employee
        return { user, details: employee };
      });

      // catch the resulting error
    } catch (error) {
      // throw error in case email already exists
      if (parseInt(error.code) === 23505) throw new RpcException(EMAIL_ALREADY_EXISTS);

      // throw failed to create user error
      throw new RpcException(FAILED_TO_CREATE_USER);
    }
  }

  async authenticate(credentials: Credentials) {
    // deconstruct credentials to expose email and password
    const { email, password } = credentials;

    // check if user with the given email exists in the database
    const user = await this.userService.crud().findOneBy({ email }, () => new MyRpcException({ message: 'Not found', code: 404 }));

    // verify if password from database matches with the given password
    await this.passwordService.verify(user.password, password, (error) => rpcError(error));

    // authenticate and return user
    return user;
  }
}
