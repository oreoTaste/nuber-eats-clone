import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { CoreInterface } from "src/common/entities/core.interface";
import { HealthRecord } from "src/health/entities/health.entity";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";

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

        @Column({comment: "비밀번호"})
        @Field({description: "비밀번호"})
        @IsString()
        password: string;

        @BeforeInsert()
        async encryptPassword(): Promise<void> {
                try {
                        this.password = await bcrypt.hash(this.password, 10);
                } catch(e) {
                        console.log(e);
                        throw new InternalServerErrorException();
                }
        }

        async checkPassword(password: string):Promise<boolean> {
                try {
                        let rslt = await bcrypt.compare(password, this.password);
                        if(rslt) {
                                return true;
                        }
                        return false;
                } catch(e) {
                        console.log(e);
                        throw new Error('wrong password');
                }
        }

}
