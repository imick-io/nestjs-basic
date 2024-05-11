import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password: 'pw',
        } as User);
      },
      findAll: () => {
        return Promise.resolve([
          {
            id: 1,
            email: 'some@email.com',
            password: 'pw',
          },
        ] as User[]);
      },
    };
    fakeAuthService = {
      signIn: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
      // signUp: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns a list of users', async () => {
    const users = await controller.findAll({ limit: 1, offset: 0 });
    expect(users).toHaveLength(1);
  });

  it('signIn updates session object and returns user', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      {
        email: 'any@email.com',
        password: 'any',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  // ...
});
