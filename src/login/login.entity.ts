import { IsStrongPassword} from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Login {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    indentifier: string;

    @IsStrongPassword()
    @Column()
    password: string;

    @OneToOne(() => User, (user) => user.login, { onDelete: 'CASCADE' })
    user: User;
}