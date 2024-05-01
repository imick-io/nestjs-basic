import { UserRefactor1714593476661 } from 'src/migrations/1714593476661-UserRefactor';
import { Language } from 'src/users/entities/language.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [User, Language],
  migrations: [UserRefactor1714593476661],
});
