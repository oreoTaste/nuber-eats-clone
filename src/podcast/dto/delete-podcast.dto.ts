import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';
import { CoreOutput } from './core/core.dto';

@InputType()
export class DeletePodcastInput extends PickType(Podcast, ['id'], InputType) {}

@ObjectType()
export class DeletePodcastOutput extends CoreOutput {}
