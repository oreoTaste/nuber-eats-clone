import { Field, InputType, Int, ObjectType, OmitType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { UserGrp } from "../entities/user.entity";

@InputType()
export class AddUserGrpInput extends OmitType(UserGrp, ['id', 'users'], InputType){}

@ObjectType()
export class AddUserGrpOutput extends CommonOutput{
    @Field(type => Int, {nullable: true})
    idUserGrp?: number;
}