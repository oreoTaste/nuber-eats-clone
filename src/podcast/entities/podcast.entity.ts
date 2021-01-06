import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Episode } from './episode.entity';

@InputType({ isAbstract: true })
@ObjectType()
export class Podcast {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  category: string;

  @Field(() => Number)
  rating: number;

  @Field(() => [Episode], { nullable: true })
  episodes?: Episode[];
}
