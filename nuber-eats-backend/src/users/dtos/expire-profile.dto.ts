import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User } from "../entities/user.entity";

@InputType()
export class ExpireProfileInput extends PickType(User, ['idLogin'], InputType){}

@ObjectType()
export class ExpireProfileOutput extends CommonOutput {}