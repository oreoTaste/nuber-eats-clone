import { Field, InputType, Int, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User, UserGrp } from "../entities/user.entity";

@InputType()
export class SearchGrpUsersInput extends PartialType(OmitType(UserGrp, ['users'], InputType), InputType){}

@ObjectType()
export class SearchGrpUsersOutput extends CommonOutput{
    @Field(type => [User], {nullable:true})
    users?: User[];
}