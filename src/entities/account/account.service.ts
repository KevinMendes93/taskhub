import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto) {
    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);

    const account = this.accountRepository.create({
      login: createAccountDto.login,
      password: hashedPassword,
      user: createAccountDto.user,
    });

    return await this.accountRepository.save(account);
  }

  findOne(login: string): Promise<Account | undefined> {
    return this.accountRepository.findOne({
      where: { login },
      relations: ['user'],
    });
  }
}
