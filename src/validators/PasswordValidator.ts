import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'passwordValidator' })
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(
    password: string,
    args?: ValidationArguments
  ): boolean | Promise<boolean> {
    return (
      password &&
      password.length >= 8 &&
      /[A-Z]/g.test(password) &&
      /[0-9]/g.test(password)
    )
  }
  defaultMessage?(args?: ValidationArguments): string {
    return 'Senha precisa conter pelo menos 8 caracteres, 1 caractere maiúsculo e 1 número'
  }
}
