import { Exclude, Expose, Transform } from 'class-transformer';
import { Role } from 'src/enums/role.enum';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  cpf: string;

  @Expose()
  roles: Role[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ obj }) => !!obj.possuiConta())
  possuiConta: boolean;
}
