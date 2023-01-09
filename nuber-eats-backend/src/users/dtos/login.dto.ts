import { Field, InputType, IntersectionType, ObjectType, PickType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User, UserPassword } from "../entities/user.entity";

@InputType()
export class LoginInput extends IntersectionType(PickType(UserPassword, ['password'] as const, InputType)
                                               , PickType(User, ['idLogin'] as const, InputType)){}

@ObjectType()
export class LoginOutput extends CommonOutput {
    @Field(type => User, {nullable: true})
    user?: User;
}