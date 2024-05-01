import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  //   @Type(() => Number) // Doing it on a global level with enableImplicitConversion
  offset: number;

  @IsOptional()
  @IsPositive()
  //   @Type(() => Number) // Doing it on a global level with enableImplicitConversion
  limit: number;
}
