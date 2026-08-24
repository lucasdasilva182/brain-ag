import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { isValidDocument } from './document.validator';

// Permite usar @IsCpfCnpj() nos DTOs, igual @IsEmail() do class-validator
export function IsCpfCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpfCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          return typeof value === 'string' && isValidDocument(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'documento deve ser um CPF ou CNPJ válido';
        },
      },
    });
  };
}
