import { InputType, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User } from "../entities/user.entity";

@InputType()
export class UpdateProfileInput extends PartialType(PickType(User, ['idLogin', 'ddBirth','nmUser','password','userGrp', 'ddExpire'], InputType), InputType){}

@ObjectType()
export class UpdateProfileOutput extends CommonOutput {}