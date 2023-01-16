// import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Type } from '@nestjs/common';
// import { plainToInstance } from 'class-transformer';
// import { validate } from 'class-validator';

// @Injectable()
// export class ValidatorPipe implements PipeTransform<unknown> {
//   async transform(value: unknown, { metatype }: ArgumentMetadata) {
//     if (!metatype || !this.toValidate(metatype)) {
//       return value;
//     }
//     const object = plainToInstance(metatype, value);

//     const errors = await validate(object);

//     if (errors.length > 0) {
//       throw new BadRequestException('Validation failed');
//     }
//     return value;
//   }

//   private toValidate(metatype: Type<unknown>): boolean {
//     const types: Type<unknown>[] = [String, Boolean, Number, Date, Array, Object];
//     console.log(types);
//     console.log(!types.includes(metatype));
//     return !types.includes(metatype);
//   }
// }
