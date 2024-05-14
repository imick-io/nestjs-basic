import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { PostDto } from './dto/post.dto';
import { ApprovePostDto } from './dto/approve-post.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Post()
  @UseGuards(AuthGuard)
  @Serialize(PostDto)
  createPost(@Body() body: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approvePost(@Param('id') id: string, @Body() body: ApprovePostDto) {
    return this.postsService.changeApproval(id, body.approved);
  }
}
