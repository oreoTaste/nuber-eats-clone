import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { HealthRecord } from "src/health/entities/health.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@ObjectType()
@InputType("UserGrpInput", {isAbstract: true})
@Entity()
export class UserGrp extends CoreEntity{
    @Column({comment: "사용자 그룹명"})
    @Field({description: "사용자 그룹명"})
    @IsString()
    nmUserGrp : string; // 사용자 그룹명

    @Column({comment: "사용자 그룹타입", default: 'GENERAL', length: 10})
    @Field({ description: "사용자 그룹타입", defaultValue: 'GENERAL'})
    @IsString()
    tpUserGrp: string; // 사용자 그룹의 타입

    @OneToMany(type=>User
            , (user) => user.userGrp
            , {eager: false, nullable: true, onDelete: "NO ACTION"})
    @Field(type => [User], {nullable: true})
    users: User[];  
}

@ObjectType()
@InputType("UserInput",{isAbstract: true})
@Entity()
export class User extends CoreEntity{
    @ManyToOne(type=>UserGrp
            , (userGrp) => userGrp.users
            , {eager: true, nullable: true, onDelete: "NO ACTION"})
    @Field(type => UserGrp, {nullable: true})
    userGrp: UserGrp;

    @OneToMany(type=>HealthRecord
            , (record) => record.user
            , {lazy: true, nullable: true, onDelete: "NO ACTION"})
    healthRecord: HealthRecord[];

    @Column({comment: "사용자명"})
    @Field({description: "사용자명"})
    @IsString()
    @Length(2, 50)
    name: string;

    @Column({length:8, nullable: true, comment: "생년월일"})
    @Field({nullable: true, description: "생년월일"})
    @IsString()
    @IsOptional()
    @Length(8)
    birthdate: string;
}