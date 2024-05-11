import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const users: User[] = [];

  const fakeUsersService: Partial<UsersService> = {
    find: (email: string) => {
      const filteredUsers = users.filter((user) => user.email === email);
      return Promise.resolve(filteredUsers?.[0]);
    },
    create: ({ email, password }) => {
      const user = {
        id: Math.floor(Math.random() * 999999),
        email,
        password,
      } as User;
      users.push(user);
      return Promise.resolve(user);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('unit@test.com', 'password');
    expect(user.password).not.toEqual('password');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signUp('asdf@asdf.com', 'whatever');
    await expect(service.signUp('asdf@asdf.com', 'whatever')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signIn('does-not@exists.com', 'password'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    const e = 'email@exists.com';
    await service.signUp(e, 'password');
    await expect(service.signIn(e, 'wrong-password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    const e = 'a-new@email.com';
    const p = 'password';
    await service.signUp(e, p);
    const user = await service.signIn(e, p);
    expect(user).toBeDefined();
  });
});
