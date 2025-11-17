import { Type } from "class-transformer";
import { IsNotEmpty, MaxLength, ValidateNested } from "class-validator";
import { UserReferenceDto } from "src/entities/user/dto/user-reference.dto";

export class CreateCategoryDto {
    
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @MaxLength(255)
    description?: string;

    @ValidateNested()
    @Type(() => UserReferenceDto)
    @IsNotEmpty({message: 'User is Required'})
    user: UserReferenceDto;
}
