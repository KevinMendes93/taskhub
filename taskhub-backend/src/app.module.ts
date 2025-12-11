import { Module } from '@nestjs/common';
import { UserModule } from './entities/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './security/auth/auth.module';
import { AccountModule } from './entities/account/account.module';
import { TaskModule } from './entities/task/task.module';
import { CategoryModule } from './entities/category/category.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(
      process.env.POSTGRES_URL
        ? {
            type: 'postgres',
            url: process.env.POSTGRES_URL,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            ssl: { rejectUnauthorized: false },
          }
        : {
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            port: Number(process.env.DATABASE_PORT) || 5432,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.ENV === 'development',
          },
    ),
    AuthModule,
    AccountModule,
    TaskModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
