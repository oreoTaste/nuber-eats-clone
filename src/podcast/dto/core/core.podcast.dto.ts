import { InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { Episode } from '../../entities/episode.entity';
import { Podcast } from '../../entities/podcast.entity';

@ObjectType()
export class PodcastPartialOutput extends PartialType(Podcast, ObjectType) {}

@ObjectType()
export class EpisodePartialOutput extends PartialType(Episode, ObjectType) {}
