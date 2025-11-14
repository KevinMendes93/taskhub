import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from 'src/entities/account/dto/create-account.dto';
import { LoginDto } from 'src/entities/account/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.login, loginDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() account: CreateAccountDto) {
    return this.authService.register(account);
  }
}
