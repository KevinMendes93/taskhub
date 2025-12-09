import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from 'src/entities/account/dto/create-account.dto';
import { LoginDto } from 'src/entities/account/dto/login.dto';
import { ApiResponse } from 'src/common/dto/api-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    const result = await this.authService.signIn(loginDto.login, loginDto.password);
    return ApiResponse.success('Login successful', result);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() account: Partial<CreateAccountDto>) {
    const result = await this.authService.register(account);
    return ApiResponse.success('Account created successfully', result);
  }
}
