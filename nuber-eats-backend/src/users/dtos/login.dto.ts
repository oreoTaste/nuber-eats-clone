import { Field, InputType, IntersectionType, ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { Entity } from "typeorm/decorator/entity/Entity";
import { User, UserGrp } from "../entities/user.entity";

@InputType()
export class LoginInput extends PickType(User, ['email', 'password'] as const, InputType){}

@ObjectType()
export class LoginOutput extends CommonOutput {
    @Field({nullable: true})
    token?: string;
}