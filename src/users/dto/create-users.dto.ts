import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { Users } from '../entities/users.entity';

@InputType()
export class CreateUserInput extends PickType(
  Users,
  ['email', 'name', 'password', 'role'],
  InputType,
) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}
