import { IsEmail, IsNotEmpty } from 'class-validator';
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
}
