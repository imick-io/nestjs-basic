import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language } from './language.entity';

@Entity() // table: user
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: 0 })
  followers: number;

  @JoinTable()
  @ManyToMany(() => Language, (language) => language.users, { cascade: true })
  languages: Language[];
}
