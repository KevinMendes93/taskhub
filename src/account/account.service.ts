import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ){}

    async createAccount(account: CreateAccountDto){
        
    }

    findOne(cpf: string): Promise<Account | undefined> {
        return this.accountRepository.findOne({ where: { login: cpf } });
    }

}
