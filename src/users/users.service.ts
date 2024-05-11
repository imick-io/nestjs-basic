import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    return this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const idNumber = +id;
    if (!idNumber || isNaN(idNumber)) {
      throw new BadRequestException('Invalid id');
    }

    const user = await this.userRepository.findOne({
      where: { id: +id },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  find(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({ ...createUserDto });
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
