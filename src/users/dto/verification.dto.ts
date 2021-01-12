import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Verification } from '../entities/verification.entity';
import { PartialUsersDto } from './core/core.users.dto';

@InputType()
export class VerificationInput extends PickType(
  Verification,
  ['code'],
  InputType,
) {}

@ObjectType()
export class VerificationOutput extends CoreOutput {
  @Field(() => PartialUsersDto, { nullable: true })
  @IsOptional()
  user?: PartialUsersDto;
}
