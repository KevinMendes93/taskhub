import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { UserModule } from 'src/entities/user/user.module';
import { Account } from './account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [AccountService],
  imports: [UserModule, TypeOrmModule.forFeature([Account])],
  exports: [AccountService],
})
export class AccountModule {}
