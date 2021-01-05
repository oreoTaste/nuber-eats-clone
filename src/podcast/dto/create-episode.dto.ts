import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEpisodeDto {
  @IsOptional()
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly story: string;
}
