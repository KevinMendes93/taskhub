import { MigrationInterface, QueryRunner } from "typeorm";

export class CompleteSchema1765492640360 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar ENUMs
        await queryRunner.query(`
            CREATE TYPE "user_roles_enum" AS ENUM('admin', 'user')
        `);
        
        await queryRunner.query(`
            CREATE TYPE "tasks_status_enum" AS ENUM('pending', 'in_progress', 'completed')
        `);

        // Criar tabela User
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "cpf" character varying NOT NULL,
                "email" character varying NOT NULL,
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP,
                "roles" "user_roles_enum" array NOT NULL DEFAULT '{user}',
                CONSTRAINT "UQ_a6235b5ef0939d8deaad755fc87" UNIQUE ("cpf"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);

        // Criar tabela Account
        await queryRunner.query(`
            CREATE TABLE "account" (
                "id" SERIAL NOT NULL,
                "login" character varying NOT NULL,
                "password" character varying NOT NULL,
                "refreshTokenHash" character varying,
                "user_id" integer,
                CONSTRAINT "UQ_1726382a57e273f66cf5f04a597" UNIQUE ("login"),
                CONSTRAINT "REL_efef1e5fdbe318a379c06678c5" UNIQUE ("user_id"),
                CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id")
            )
        `);

        // Criar tabela Category
        await queryRunner.query(`
            CREATE TABLE "category" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text,
                "user_id" integer,
                CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")
            )
        `);

        // Criar tabela Task
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "description" character varying NOT NULL,
                "status" "tasks_status_enum" NOT NULL DEFAULT 'pending',
                "due_date" date,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP,
                "user_id" integer,
                "category_id" integer,
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
            )
        `);

        // Adicionar Foreign Keys
        await queryRunner.query(`
            ALTER TABLE "account" 
            ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" 
            FOREIGN KEY ("user_id") 
            REFERENCES "user"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "category" 
            ADD CONSTRAINT "FK_32b856438dffde625f0613a4f15" 
            FOREIGN KEY ("user_id") 
            REFERENCES "user"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" 
            FOREIGN KEY ("user_id") 
            REFERENCES "user"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD CONSTRAINT "FK_4f7d2c829a6e03c394936a3f5f8" 
            FOREIGN KEY ("category_id") 
            REFERENCES "category"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover Foreign Keys
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_4f7d2c829a6e03c394936a3f5f8"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_32b856438dffde625f0613a4f15"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`);

        // Remover tabelas
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "user"`);

        // Remover ENUMs
        await queryRunner.query(`DROP TYPE "tasks_status_enum"`);
        await queryRunner.query(`DROP TYPE "user_roles_enum"`);
    }

}

