import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

// Carrega as variáveis de ambiente
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false, // IMPORTANTE: DataSource sempre usa false, migrations controlam o schema
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  logging: process.env.ENV === 'development',
});
