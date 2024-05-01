import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Language } from './entities/language.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    return this.userRepository.find({
      relations: { languages: true },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
      relations: { languages: true },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const languages = await Promise.all(
      createUserDto.languages.map((name) => this.preloadLanguageByName(name)),
    );

    const user = this.userRepository.create({ ...createUserDto, languages });
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const languages =
      updateUserDto.languages &&
      (await Promise.all(
        updateUserDto.languages.map((name) => this.preloadLanguageByName(name)),
      ));

    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
      languages,
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

  async followUser(user: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      user.followers++;
      await this.userRepository.save(user);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadLanguageByName(name: string): Promise<Language> {
    const existingLanguage = await this.languageRepository.findOne({
      where: { name },
    });
    if (existingLanguage) {
      return existingLanguage;
    }
    return this.languageRepository.create({ name });
  }
}
