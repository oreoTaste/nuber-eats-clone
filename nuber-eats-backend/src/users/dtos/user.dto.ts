import { ArgsType, Field, InputType, ObjectType, OmitType, PartialType, PickType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User, UserGrp } from "../entities/user.entity";


@InputType()
export class GetUsrInfosInput extends PickType(UserGrp, ['id'], InputType){}
@ObjectType()
export class GetUsrInfosOutput extends CommonOutput{
    @Field(type => [User], {nullable:true})
    users?: User[];
}
@InputType()
export class UserGrpInput extends OmitType(UserGrp, ['id'], InputType){}

@ArgsType()
export class UserGrpArgs extends OmitType(UserGrp, ['id'], ArgsType){}

@ObjectType()
export class UserGrpOutput extends PartialType(UserGrp, ObjectType){}

@InputType()
export class UserInput extends OmitType(User, ['id'], InputType){}

@ArgsType()
export class UserArgs extends OmitType(User, ['id'], ArgsType){}

@ObjectType()
export class UserOutput extends PartialType(User, ObjectType){}
