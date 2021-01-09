import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';
import { Podcast } from '../entities/podcast.entity';
import { CoreOutput } from '../../common/dto/core.dto';
import { EpisodePartialOutput } from './core/core.podcast.dto';

@InputType()
export class MyEpisodeInput extends PickType(Episode, ['id'], InputType) {
  @Field(() => Int)
  podcastId: number;
}

@InputType()
export class AllEpisodesInput extends PickType(Podcast, ['id'], InputType) {}

@ObjectType()
export class MyEpisodeOutput extends CoreOutput {
  @Field(() => EpisodePartialOutput, { nullable: true })
  episode: EpisodePartialOutput;
}

@ObjectType()
export class AllEpisodesOutput extends CoreOutput {
  @Field(() => [EpisodePartialOutput], { nullable: true })
  episodes: EpisodePartialOutput[];
}
