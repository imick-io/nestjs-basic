import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.languages)
  users: User[];
}
