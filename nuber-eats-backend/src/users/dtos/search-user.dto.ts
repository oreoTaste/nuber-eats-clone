import { Field, InputType, Int, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User } from "../entities/user.entity";


@InputType()
export class SearchUserInput extends PartialType(OmitType(User, ['id', 'password'] as const, InputType), InputType){
    @Field(type => Int, {nullable: true})
    idUserGrp?: number;

    @Field(type => Int, {nullable: true})
    idUser?: number;
}

@ObjectType()
export class SearchUserOutput extends CommonOutput{
    @Field(type => [User], {nullable:true})
    user?: User[];
}
