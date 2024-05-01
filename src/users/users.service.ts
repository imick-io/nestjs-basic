import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/coffee.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'User 1',
      email: 'johndoe@hotmail.com',
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const coffee = this.users.find((item) => item.id === +id);
    if (!coffee) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: any) {
    this.users.push(createCoffeeDto);
  }

  update(id: string, updateUserDto: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      // update the existing entity
    }
  }

  remove(id: string) {
    const coffeeIndex = this.users.findIndex((item) => item.id === +id);
    if (coffeeIndex >= 0) {
      this.users.splice(coffeeIndex, 1);
    }
  }
}
