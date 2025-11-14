import { Type } from 'class-transformer';
import { IsNotEmpty, IsStrongPassword, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IsUnique } from 'src/validators/is-unique.validator';
import { Account } from '../account.entity';

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
