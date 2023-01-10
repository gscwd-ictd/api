import { generateMetadata } from '@gscwd-api/entities';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Employee } from '../../employee';
import { User } from '../../user';

type RegistedUser = {
  user: User;
  details: Employee;
};

type AuthenticatedUser = {
  userId: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class RegisteredUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data: RegistedUser) => {
        // remove the password field from user's return value for security
        delete data.user['password'];

        // remove userId field from details' return value as it serves no purpose
        delete data.details['userId'];

        // return user and  employee details with their corresponding metadata
        return { user: generateMetadata(data.user), details: generateMetadata(data.details) };
      })
    );
  }
}

@Injectable()
export class AuthenticatedUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data: AuthenticatedUser) => {
        // remove the password field
        delete data['password'];

        // return the resulting data
        return data;
      })
    );
  }
}
