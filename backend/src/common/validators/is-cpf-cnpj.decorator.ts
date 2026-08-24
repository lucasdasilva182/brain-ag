import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { isValidDocument } from './document.validator';

// Permite usar @IsCpfCnpj() nos DTOs, igual @IsEmail() do class-validator.
export function IsCpfCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpfCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isValidDocument(value);
        },
        defaultMessage() {
          return 'documento deve ser um CPF ou CNPJ válido';
        },
      },
    });
  };
}
