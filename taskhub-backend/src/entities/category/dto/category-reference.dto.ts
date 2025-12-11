import { IsNotEmpty, IsNumber } from 'class-validator';

export class CategoryReferenceDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
