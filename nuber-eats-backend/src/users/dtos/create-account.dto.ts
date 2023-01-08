import { Field, InputType, Int, IntersectionType, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User, UserGrp } from "../entities/user.entity";

@InputType()
export class CreateAccountInput extends IntersectionType(OmitType(User, ['id', 'passwords', 'desc', 'userGrp'], InputType)
                                                       , PartialType(OmitType(UserGrp, ['id', 'users', 'desc', 'idInsert'], InputType), InputType)){
    @Field({description: "사용자 그룹 코멘트", nullable: true})
    @IsString()
    @IsOptional()
    descUserGrp?: string; // 사용자 그룹명

    @Field({description: "사용자 코멘트", nullable: true})
    @IsString()
    @IsOptional()
    descUser?: string; // 사용자 그룹명

    @Field(type => Int, {nullable: true})
    idUser?: number;

    @Field({description: "비밀번호"})
    @IsString()
    password: string;
}    

@ObjectType()
export class CreateAccountOutput extends CommonOutput{
    @Field(type => Int, {nullable: true})
    @IsNumber()
    @IsOptional()
    idUser?: number;
}