import { Module } from '@nestjs/common';
import { UserModule } from './entities/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './security/auth/auth.module';
import { AccountModule } from './entities/account/account.module';
import { TaskModule } from './entities/task/task.module';
import { CategoryModule } from './entities/category/category.module';
import { AppDataSource } from './data-source';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...(AppDataSource.options as DataSourceOptions),
      synchronize: process.env.ENV === 'development',
    }),
    AuthModule,
    AccountModule,
    TaskModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
