// import { DatabaseEntity, generateMetadata } from '@gscwd-api/entities';
// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { map, Observable } from 'rxjs';

// @Injectable()
// export class MetadataInterceptor<T> implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
//     return next.handle().pipe(
//       map((data: T) => {
//         // check if the result of the request is of type database entity
//         if (data instanceof DatabaseEntity) return generateMetadata(data);

//         // check if the result of the request is of array type
//         if (Array.isArray(data)) {
//           // loop through each object, and check if it is of type database entity
//           // if object a database entity, then transform its data
//           // otherwise, return the object as is
//           return data.map((result) => (result instanceof DatabaseEntity ? generateMetadata(result) : result));
//         }

//         // if none of the conditions apply, return the object as is
//         return data;
//       })
//     );
//   }
// }
