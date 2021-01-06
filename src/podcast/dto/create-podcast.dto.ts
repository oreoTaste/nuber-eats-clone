import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreOutput } from './core/core.dto';

@InputType()
export class CreatePodcastInput {
  @Field((type) => String)
  @IsString()
  readonly title: string;

  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  readonly category: string;

  @Field((type) => Number)
  @IsNumber()
  readonly rating: number;
}

@ObjectType()
export class CreatePodcastOutput extends CoreOutput {}
