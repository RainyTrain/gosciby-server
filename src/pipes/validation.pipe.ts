/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

type ErrorMessage = {
  property: string;
  messages: Array<string>;
};

@Injectable()
export class ValidationPipe implements PipeTransform<any, any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length) {
      const message: ErrorMessage[] = errors.map((error) => {
        return {
          property: error.property,
          messages: Object.values(error.constraints!).map((value) => value),
        };
      });

      throw new ValidationException(message);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
