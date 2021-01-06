import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';
import { CoreOutput } from './core/core.dto';

@InputType()
export class UpdateEpisodeInput extends PartialType(
  PickType(Episode, ['story', 'title'], InputType),
) {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  podcastId: number;
}

@ObjectType()
export class UpdateEpisodeOutput extends CoreOutput {}
