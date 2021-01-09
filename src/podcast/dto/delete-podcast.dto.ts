import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Podcast } from '../entities/podcast.entity';

@InputType()
export class DeletePodcastInput extends PickType(Podcast, ['id'], InputType) {}

@ObjectType()
export class DeletePodcastOutput extends CoreOutput {}
