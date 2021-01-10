import { Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';
import { CoreOutput } from 'src/common/dto/core.dto';

@InputType()
export class CreateEpisodeInput extends OmitType(
  Episode,
  ['id', 'updatedAt', 'createdAt'],
  InputType,
) {
  @Field(() => Int)
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {}
