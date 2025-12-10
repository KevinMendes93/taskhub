import { Type } from "class-transformer";
import { IsEmpty, IsEnum, IsNotEmpty, ValidateNested } from "class-validator";
import { CategoryReferenceDto } from "src/entities/category/dto/category-reference.dto";
import { UserReferenceDto } from "src/entities/user/dto/user-reference.dto";
import { Status } from "src/enums/status.enum";

export class CreateTaskDto {
    
    @IsNotEmpty({ message: 'Title should not be empty' })
    title: string;

    @IsNotEmpty({ message: 'Description should not be empty' })
    description: string;

    @IsEnum(Status, { message: 'Status must be a valid enum value' })
    status: Status;

    @IsEmpty({ message: 'DueDate must be empty or a valid date' })
    dueDate?: Date;

    @ValidateNested()
    @Type(() => UserReferenceDto)
    @IsNotEmpty({message: 'User is Required'})
    user: UserReferenceDto;
    
    @ValidateNested()
    @Type(() => CategoryReferenceDto)
    @IsNotEmpty({message: 'Category is Required'})
    category: CategoryReferenceDto;
}
