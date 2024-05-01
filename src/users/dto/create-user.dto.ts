import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsString({ each: true })
  readonly languages: string[];
}
