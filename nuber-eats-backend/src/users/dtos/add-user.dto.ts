import { Field, InputType, Int, ObjectType, OmitType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User } from "../entities/user.entity";

@InputType()
export class AddUserInput extends OmitType(User, ['id', 'userGrp'], InputType){
    @Field(type => Int, {nullable: true})
    idUserGrp: number;
}

@ObjectType()
export class AddUserOutput extends CommonOutput{
    @Field(type => Int, {nullable: true})
    idUser?: number;
}

