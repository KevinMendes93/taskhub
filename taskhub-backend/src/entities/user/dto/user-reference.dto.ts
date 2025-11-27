import { IsNotEmpty, IsNumber } from "class-validator";

export class UserReferenceDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}