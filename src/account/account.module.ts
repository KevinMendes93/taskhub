import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AccountService],
  imports: [UserModule],
  exports: [AccountService],
})
export class AccountModule {}
