import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

@Injectable()
export class AuthService {
    constructor(private accountService: AccountService){}

    async signIn(cpf: string, pass: string): Promise<any> {
        const user = await this.accountService.findOne(cpf);
        if (user?.password !== pass) {
          throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        // TODO: Generate a JWT and return it here
        // instead of the user object
        return result;
      }

    async register(account: CreateAccountDto){
      
    }
}
