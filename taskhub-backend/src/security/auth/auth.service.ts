import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/entities/account/account.service';
import { CreateAccountDto } from 'src/entities/account/dto/create-account.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { AccountResponseDto } from 'src/entities/account/dto/account-response.dto';
import * as jwt from 'jsonwebtoken';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  private static readonly INVALID_CREDENTIALS_MESSAGE =
    "User or Password don't match";
  private static readonly INVALID_REFRESH_TOKEN_MESSAGE =
    'Invalid refresh token';
  private static readonly EXPIRED_REFRESH_TOKEN_MESSAGE =
    'Invalid or expired refresh token';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = '7d';

  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(login: string, pass: string): Promise<AuthTokens> {
    const account = await this.validateUserCredentials(login, pass);

    const accessToken = await this.generateAccessToken(account);
    const refreshToken = this.generateRefreshToken(account);

    await this.accountService.setRefreshToken(account.id, refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const decoded = this.verifyRefreshToken(refreshToken);
    const account = await this.validateStoredRefreshToken(
      decoded.sub,
      refreshToken,
    );

    const accessToken = await this.generateAccessToken(account);
    const newRefreshToken = this.generateRefreshToken(account);

    await this.accountService.setRefreshToken(account.id, newRefreshToken);

    return { access_token: accessToken, refresh_token: newRefreshToken };
  }

  async logout(userId: number): Promise<void> {
    const account = await this.accountService.findById(userId);

    if (!account) return;

    await this.accountService.clearRefreshToken(account.id);
  }

  async register(account: Partial<CreateAccountDto>) {
    const createdAccount = await this.accountService.createAccount(account);
    return plainToInstance(AccountResponseDto, createdAccount);
  }

  private async validateUserCredentials(login: string, password: string) {
    const account = await this.accountService.findOne(login);

    if (!account || !account.password) {
      throw new UnauthorizedException(AuthService.INVALID_CREDENTIALS_MESSAGE);
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      throw new UnauthorizedException(AuthService.INVALID_CREDENTIALS_MESSAGE);
    }

    this.ensureUserExists(account);

    return account;
  }

  private async generateAccessToken(account: any): Promise<string> {
    const payload = this.buildAccessTokenPayload(account);
    return this.jwtService.signAsync(payload);
  }

  private generateRefreshToken(account: any): string {
    this.ensureUserExists(account);

    const payload = { sub: account.user.id };
    const secret = this.getRefreshSecret();

    return jwt.sign(payload, secret, {
      expiresIn: AuthService.REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  private verifyRefreshToken(refreshToken: string): any {
    try {
      const secret = this.getRefreshSecret();
      return jwt.verify(refreshToken, secret) as any;
    } catch {
      throw new UnauthorizedException(
        AuthService.EXPIRED_REFRESH_TOKEN_MESSAGE,
      );
    }
  }

  private async validateStoredRefreshToken(
    userId: number,
    refreshToken: string,
  ) {
    const account = await this.accountService.findById(userId);

    if (!account || !account.refreshTokenHash) {
      throw new UnauthorizedException(
        AuthService.INVALID_REFRESH_TOKEN_MESSAGE,
      );
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      account.refreshTokenHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException(
        AuthService.INVALID_REFRESH_TOKEN_MESSAGE,
      );
    }

    this.ensureUserExists(account);

    return account;
  }

  private buildAccessTokenPayload(account: any) {
    this.ensureUserExists(account);

    const { user } = account;

    return {
      sub: user.id,
      username: user.name,
      email: user.email,
      roles: user.roles,
    };
  }

  private getRefreshSecret(): string {
    return String(process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  }

  private ensureUserExists(account: any): void {
    if (!account?.user) {
      throw new UnauthorizedException(AuthService.INVALID_CREDENTIALS_MESSAGE);
    }
  }
}
