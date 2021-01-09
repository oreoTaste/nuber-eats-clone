import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';
import { CoreOutput } from '../../common/dto/core.dto';
import { PodcastPartialOutput } from './core/core.podcast.dto';

@InputType()
export class MyPodcastInput extends PickType(Podcast, ['id'], InputType) {}

@ObjectType()
export class MyPodcastOutput extends CoreOutput {
  @Field(() => PodcastPartialOutput)
  podcast: PodcastPartialOutput;
}

@ObjectType()
export class AllPodcastsOutput extends CoreOutput {
  @Field(() => [PodcastPartialOutput], { nullable: true || 'itemsAndList' })
  podcasts?: PodcastPartialOutput[];
}
