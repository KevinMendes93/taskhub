import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Login is required' })
  login: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
