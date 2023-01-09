import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { CoreInterface } from "src/common/entities/core.interface";
import { HealthRecord } from "src/health/entities/health.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@ObjectType()
@InputType("UserGrpInput", {isAbstract: true})
@Entity()
export class UserGrp extends CoreEntity implements CoreInterface{
        @PrimaryGeneratedColumn({name: "ID_USER_GRP", primaryKeyConstraintName: "PK_USER_GRP"})
        @Field(type=> Int, {nullable: false})
        @IsNumber()
        id: number;

        @Column({comment: "사용자 그룹명"})
        @Field({description: "사용자 그룹명"})
        @IsString()
        nmUserGrp : string; // 사용자 그룹명

        @Column({comment: "사용자 그룹타입", default: 'GENERAL', length: 10})
        @Field({description: "사용자 그룹타입", nullable: true})
        @IsString()
        @IsOptional()
        tpUserGrp: string; // 사용자 그룹의 타입

        @OneToMany(type=>User
                , (user) => user.userGrp
                , {eager: false, nullable: true, createForeignKeyConstraints: false, orphanedRowAction: "disable", onDelete: "NO ACTION", onUpdate: "CASCADE"})
        @Field(type => [User], {nullable: true})
        users: User[];  
}

@ObjectType()
@InputType("UserInput",{isAbstract: true})
@Entity()
export class User extends CoreEntity implements CoreInterface{
        @PrimaryGeneratedColumn({name: "ID_USER", primaryKeyConstraintName: "PK_USER"})
        @Field(type=> Int, {nullable: false})
        @IsNumber()
        id: number;

        @Column({comment: "사용자ID"})
        @Field({description: "사용자ID"})
        @IsString()
        idLogin: string;

        @ManyToOne(type=>UserGrp
                , (userGrp) => userGrp.users
                , {eager: false, nullable: true, createForeignKeyConstraints: false, orphanedRowAction: "disable", onDelete: "NO ACTION", onUpdate: "CASCADE"})
        @Field(type => UserGrp, {nullable: true})
        userGrp: UserGrp;

        @OneToMany(type=>HealthRecord
                , (record) => record.user
                , {eager: false, nullable: true, createForeignKeyConstraints: false, orphanedRowAction: "disable", onDelete: "NO ACTION", onUpdate: "CASCADE"})
        @Field(type => [HealthRecord], {nullable: true})
        healthRecords: HealthRecord[];

        @Column({comment: "사용자명"})
        @Field({description: "사용자명"})
        @IsString()
        @Length(2, 50)
        nmUser: string;

        @Column({length:8, nullable: true, comment: "생년월일"})
        @Field({nullable: true, description: "생년월일"})
        @IsString()
        @IsOptional()
        @Length(8,8)
        ddBirth: string;

        @OneToMany(type=>UserPassword
                , (password)=>password.user
                , {eager: false, createForeignKeyConstraints: false, nullable: true})
        @Field(type => [UserPassword], {nullable: true})
        passwords: UserPassword[];
}

@ObjectType()
@InputType("UserPasswordInput",{isAbstract: true})
@Entity()
export class UserPassword extends CoreEntity implements CoreInterface{
        @PrimaryGeneratedColumn({name: "ID_USER_PASSWORD", primaryKeyConstraintName: "PK_USER_PASSWORD"})
        @Field(type=> Int, {nullable: false})
        @IsNumber()    
        id: number;

        @ManyToOne(type=>User
                , (user)=> user.passwords
                , {eager: false, createForeignKeyConstraints: false, nullable: true})
        @Field(type => User, {name: "ID_USER", nullable: true})
        user?: User;

        @Column({comment: "비밀번호"})
        @Field({description: "비밀번호"})
        @IsString()
        password: string;

        @Column({length:8, default: "99991231", comment: "유효일자"})
        @Field({description: "유효일자"})
        @IsString()
        @Length(8,8)
        ddExpire: string;
}