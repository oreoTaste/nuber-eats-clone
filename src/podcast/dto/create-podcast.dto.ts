import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';
import { CoreOutput } from './core/core.dto';

@InputType()
export class CreatePodcastInput extends PickType(
  Podcast,
  ['title', 'category', 'rating'],
  InputType,
) {}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {}
