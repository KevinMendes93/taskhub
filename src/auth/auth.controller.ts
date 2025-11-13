import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto.cpf, signInDto.password);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body() account: CreateAccountDto) {
      return this.authService.register(account);
    }
}
