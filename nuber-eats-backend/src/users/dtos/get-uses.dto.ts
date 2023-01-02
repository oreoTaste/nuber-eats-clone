import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User, UserGrp } from "../entities/user.entity";

@InputType()
export class GetUsersInput extends PickType(UserGrp, ['id'], InputType){}

@ObjectType()
export class GetUsersOutput extends CommonOutput{
    @Field(type => [User], {nullable:true})
    users?: User[];
}