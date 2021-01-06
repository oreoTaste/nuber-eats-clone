import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';
import { CoreOutput } from './core/core.dto';

@InputType()
export class DeleteEpisodeInput extends PickType(Episode, ['id'], InputType) {
  @Field(() => Int)
  podcastId: number;
}

@ObjectType()
export class DeleteEpisodeOutput extends CoreOutput {}
