import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/enums/role.enum';
import { IsCPF } from 'src/validators/is-cpf.validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'CPF is required' })
  @IsCPF({ message: 'Invalid CPF' })
  cpf: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsEnum(Role, { each: true, message: 'Each role must be a valid Role enum value', })
  roles?: Role[];
}
