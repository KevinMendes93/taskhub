import { Account } from "src/account/account.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    cpf: string;

    @Column({ unique: true })
    email: string;
    
    @Column()
    name: string;

    @Column({default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({onUpdate: 'CURRENT_TIMESTAMP', nullable: true})
    updatedAt: Date;

    @OneToOne(() => Account, login => login.user, { cascade: true })
    account: Account;
}
