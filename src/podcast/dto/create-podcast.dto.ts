import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Episode } from '../entities/episode.entity';

export class CreatePodcastDto {
  @IsOptional()
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly title: string;

  @IsString()
  readonly category: string;

  @IsNumber()
  readonly rating: number;

  @IsOptional()
  @IsNumber()
  readonly episodes: Episode[];
}
