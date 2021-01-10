import { ObjectType, PartialType } from '@nestjs/graphql';
import { Users } from 'src/users/entities/users.entity';

@ObjectType()
export class PartialUsersDto extends PartialType(Users, ObjectType) {}
