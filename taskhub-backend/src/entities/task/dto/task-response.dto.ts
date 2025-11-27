import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from 'src/entities/category/dto/category-response.dto';
import { UserResponseDto } from 'src/entities/user/dto/user-response.dto';

@Exclude()
export class TaskResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  dueDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;
}