import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Users } from '../entities/users.entity';
import { PartialUsersDto } from './core/core.users.dto';

@InputType()
export class UserLoginInput extends PickType(
  Users,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class UserLoginOutput extends CoreOutput {
  @Field(() => PartialUsersDto, { nullable: true })
  @IsOptional()
  user?: PartialUsersDto;

  @Field(() => String, { nullable: true })
  token?: string;
}
