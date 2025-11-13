import { IsEmpty, IsStrongPassword } from "class-validator";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateAccountDto {

    @IsEmpty({message: 'Login should not be provided'})
    login: string;

    @IsStrongPassword()
    @IsEmpty({message: 'Password should not be provided'})
    password: string;
    
    user: CreateUserDto;
}