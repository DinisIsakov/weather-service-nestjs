import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ActionsEntity } from './actions.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  fio: string;

  @Column({ unique: true })
  apiToken: string;

  @OneToMany(() => ActionsEntity, (actions) => actions.user)
  actions: ActionsEntity[];
}
