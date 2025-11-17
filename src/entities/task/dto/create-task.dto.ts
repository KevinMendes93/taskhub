import { IsEnum, IsNotEmpty } from "class-validator";
import { Status } from "src/enums/status.enum";

export class CreateTaskDto {
    
    @IsNotEmpty({ message: 'Title should not be empty' })
    title: string;

    @IsNotEmpty({ message: 'Description should not be empty' })
    description: string;

    @IsEnum(Status, { message: 'Status must be a valid enum value' })
    status: Status;

    dueDate?: Date;

    @IsNotEmpty({ message: 'User ID should not be empty' })
    userId: number;
    categoryId: number;
}
