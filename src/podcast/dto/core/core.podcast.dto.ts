import { ObjectType, PartialType } from '@nestjs/graphql';
import { Episode } from 'src/podcast/entities/episode.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@ObjectType()
export class PodcastPartialOutput extends PartialType(Podcast, ObjectType) {}

@ObjectType()
export class EpisodePartialOutput extends PartialType(Episode, ObjectType) {}
