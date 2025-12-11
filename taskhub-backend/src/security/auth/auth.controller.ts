import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from 'src/entities/account/dto/create-account.dto';
import { LoginDto } from 'src/entities/account/dto/login.dto';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(
      loginDto.login,
      loginDto.password,
    );

    // Setar refresh token como cookie httpOnly
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.ENV === 'production', // HTTPS apenas em produção
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
    });

    // Retornar apenas access_token no body
    return ApiResponse.success('Login successful', {
      access_token: result.access_token,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return ApiResponse.error('Refresh token not found');
    }

    const result = await this.authService.refreshTokens(refreshToken);

    // Atualizar cookie com novo refresh token (rotação)
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.success('Tokens refreshed successfully', {
      access_token: result.access_token,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user?.sub;

    if (userId) {
      await this.authService.logout(userId);
    }

    // Limpar cookie de refresh token
    res.clearCookie('refresh_token');

    return ApiResponse.success('Logout successful', null);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() account: Partial<CreateAccountDto>) {
    const result = await this.authService.register(account);
    return ApiResponse.success('Account created successfully', result);
  }
}
