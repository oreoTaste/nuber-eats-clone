import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Episode } from '../entities/episode.entity';

@InputType()
export class DeleteEpisodeInput extends PickType(Episode, ['id'], InputType) {
  @Field(() => Int)
  podcastId: number;
}

@ObjectType()
export class DeleteEpisodeOutput extends CoreOutput {}
