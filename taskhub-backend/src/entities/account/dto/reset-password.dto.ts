import { IsJWT, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsStrongPassword({}, { message: 'Password must be strong' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsJWT({ message: 'Token must be a valid JWT' })
  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}
