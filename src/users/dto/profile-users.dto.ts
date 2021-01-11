import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { PartialUsersDto } from './core/core.users.dto';

@ArgsType()
export class ProfileInput {
  @Field(() => Number)
  id: number;
}

@ObjectType()
export class ProfileOutput extends CoreOutput {
  @Field(() => PartialUsersDto, { nullable: true })
  @IsOptional()
  user?: PartialUsersDto;
}
