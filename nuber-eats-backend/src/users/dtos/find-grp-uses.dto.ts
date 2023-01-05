import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User } from "../entities/user.entity";

@InputType()
export class FindGrpUsersInput {
    @Field(type => Int, {nullable: true})
    idUserGrp: number;
}

@ObjectType()
export class FindGrpUsersOutput extends CommonOutput{
    @Field(type => [User], {nullable:true})
    users?: User[];
}