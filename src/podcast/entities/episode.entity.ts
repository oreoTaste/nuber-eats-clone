import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType({ isAbstract: true })
export class Episode {
  @Field((is) => Int)
  id: number;
  @Field((is) => String)
  title: string;
  @Field((is) => String)
  story: string;
}
