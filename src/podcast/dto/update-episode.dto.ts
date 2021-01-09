import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Episode } from '../entities/episode.entity';

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
