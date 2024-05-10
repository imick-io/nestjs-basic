import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
