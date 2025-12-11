import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/entities/user/dto/user-response.dto';

@Exclude()
export class CategoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
