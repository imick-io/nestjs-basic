import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  readonly title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  readonly content: string;
}
