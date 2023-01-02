import { Field, InputType, Int, ObjectType, OmitType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User } from "../entities/user.entity";

@InputType()
export class InsertUserInput extends OmitType(User, ['id', 'userGrp'], InputType){
    @Field(type => Int, {nullable: true})
    idUserGrp: number;
}

@ObjectType()
export class InsertUserOutput extends CommonOutput{
    @Field(type => Int, {nullable: true})
    idUser?: number;
}

