import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from 'src/entities/account/dto/create-account.dto';
import { LoginDto } from 'src/entities/account/dto/login.dto';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('register')
  async register(@Body() account: CreateAccountDto) {
    const result = await this.authService.register(account);
    return ApiResponse.success('Account created successfully', result);
  }
}
