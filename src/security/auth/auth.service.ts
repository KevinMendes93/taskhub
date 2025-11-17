import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/entities/account/account.service';
import { CreateAccountDto } from 'src/entities/account/dto/create-account.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { AccountResponseDto } from 'src/entities/account/dto/account-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async signIn(login: string, pass: string): Promise<any> {
    const account = await this.accountService.findOne(login);

    const isMatch = account
      ? await bcrypt.compare(pass, account?.password)
      : false;

    if (!isMatch) throw new UnauthorizedException("User or Password don't match");

    const payload = {
      sub: account.id,
      username: account.user.name,
      email: account.user.email,
      roles: account.user.roles
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(account: CreateAccountDto) {
    const createdAccount = await this.accountService.createAccount(account);

    return plainToInstance(AccountResponseDto, createdAccount);
  }
}
