import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  create(postDto: CreatePostDto, user: User) {
    const post = this.postRepository.create(postDto);
    post.user = user;
    return this.postRepository.save(post);
  }

  async changeApproval(id: string, approved: boolean) {
    const post = await this.postRepository.findOne({ where: { id: +id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.approved = approved;
    return this.postRepository.save(post);
  }
}
