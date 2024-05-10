import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const user = await this.usersService.find(email);
    if (!!user) {
      // User already exists
      throw new BadRequestException('User already exists');
    }
    return this.usersService.create({ email, password });
  }

  signIn(email: string, password: string) {}
}
