import { ArgsType, InputType, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import { User, UserGrp } from "../entities/user.entity";

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
