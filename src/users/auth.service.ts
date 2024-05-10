import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const user = await this.usersService.find(email);
    if (!!user) {
      // User already exists
      throw new BadRequestException('User already exists');
    }
    // Hash the password
    // First, generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed password and the salt
    const result = salt + '.' + hash.toString('hex');

    return this.usersService.create({ email, password: result });
  }

  async signIn(email: string, password: string) {
    // Look for the email address
    const user = await this.usersService.find(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Split the stored password
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
