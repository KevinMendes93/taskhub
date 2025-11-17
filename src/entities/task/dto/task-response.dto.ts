import { Exclude, Expose, Type } from 'class-transformer';

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
  @Type(() => Object)
  user: {
    id: number;
    name: string;
    email: string;
  };

  @Expose()
  @Type(() => Object)
  category: {
    id: number;
    name: string;
  };
}