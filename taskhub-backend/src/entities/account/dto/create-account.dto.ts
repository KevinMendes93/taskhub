import { Type } from 'class-transformer';
import { IsNotEmpty, IsStrongPassword, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/entities/user/dto/create-user.dto';

export class CreateAccountDto {
  @IsNotEmpty({ message: 'Login is required' })
  login: string;

  @IsStrongPassword({}, { message: 'Password must be strong' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
