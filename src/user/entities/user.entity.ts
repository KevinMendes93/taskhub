import { Login } from "src/login/login.entity";
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

    @OneToOne(() => Login, login => login.user, { cascade: true })
    @JoinColumn({name: 'user_id'})
    login: Login;
}
