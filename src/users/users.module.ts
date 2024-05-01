import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Language } from './entities/language.entity';
import { Event } from 'src/events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Language, Event])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
