import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Users } from '../entities/users.entity';

@InputType()
export class EditUserInput extends PartialType(
  PickType(Users, ['email', 'password'], InputType),
) {}
