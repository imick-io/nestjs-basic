import { IsBoolean } from 'class-validator';

export class ApprovePostDto {
  @IsBoolean()
  approved: boolean;
}
