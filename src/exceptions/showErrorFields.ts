import { ValidationError } from 'class-validator';
import { ValidationException } from './validation.exception';

type ErrorMessage = {
  property: string;
  messages: Array<string>;
};

export const showErrorFields = (errors: ValidationError[]) => {
  const message: ErrorMessage[] = errors.map((error) => {
    return {
      property: error.property,
      messages: Object.values(error.constraints!).map((value) => value),
    };
  });

  throw new ValidationException(message);
};
