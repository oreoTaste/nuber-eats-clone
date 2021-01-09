import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Podcast } from '../entities/podcast.entity';
import { CoreOutput } from 'src/common/dto/core.dto';

@InputType()
export class UpdatePodcastInput extends PartialType(
  PickType(Podcast, ['title', 'category', 'rating'], InputType),
) {
  @Field(() => Number)
  id: number;
}

@ObjectType()
export class UpdatePodcastOutput extends CoreOutput {}
