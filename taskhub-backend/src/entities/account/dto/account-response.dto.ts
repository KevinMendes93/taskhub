import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/entities/user/dto/create-user.dto';
import { UserResponseDto } from 'src/entities/user/dto/user-response.dto';

@Exclude()
export class AccountResponseDto {
  @Expose()
  login: string;

  @Expose()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: UserResponseDto;
}
