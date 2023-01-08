import { Field, InputType, Int, ObjectType, PartialType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User, UserGrp } from "../entities/user.entity";

@InputType()
export class SearchGrpUsersInput extends PartialType(UserGrp, InputType){}

@ObjectType()
export class SearchGrpUsersOutput extends CommonOutput{
    @Field(type => [User], {nullable:true})
    users?: User[];
}