import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsDate, IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { CoreInterface } from "src/common/entities/core.interface";
import { HealthRecord } from "src/health/entities/health.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";
import { JoinColumn } from "typeorm/decorator/relations/JoinColumn";

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

        @Column({comment: "사용자ID(이메일주소)"})
        @Field({description: "사용자ID(이메일주소)"})
        @IsEmail()
        email: string;

        @OneToMany(type=>EmailVerification, (veri)=>{veri.user}, {eager: false, createForeignKeyConstraints: false})
        emailVerification: EmailVerification[];

        @Column({comment: "이메일 검증일시", default: null})
        @Field({description: "이메일 검증일시", nullable: true})
        @IsDate()
        @IsOptional()
        dtEmailVerified: Date;

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

        @Column({length:8, nullable: true, comment: "만료일"})
        @Field({nullable: true, description: "만료일"})
        @IsString()
        @IsOptional()
        @Length(8,8)
        ddExpire: string;

        @BeforeInsert()
        @BeforeUpdate()
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

        // @IsOptional()
        // toString() {
        //         return `id:${this.id}, nmUser:${this.nmUser}, nmUser:${this.ddBirth}, ddExpire:${this.ddExpire}, ddBirth:${this.ddBirth}, dtEmailVerified:${this.dtEmailVerified}, email:${this.email}`;
        // }
}



@ObjectType()
@InputType("VerificationInput",{isAbstract: true})
@Entity()
export class EmailVerification extends CoreEntity implements CoreInterface{

        @PrimaryGeneratedColumn({name: "ID_EMAIL_VERIFICATION", primaryKeyConstraintName: "PK_EMAIL_VERIFICATION"})
        @Field(type=> Int, {nullable: false})
        @IsNumber()
        id: number;

        @Column({comment: "이메일검증코드"})
        @Field({nullable: true, description: "이메일검증코드"})
        code: string;

        @ManyToOne(type=>User, (user)=>{user.emailVerification}, {eager: false, createForeignKeyConstraints: true})
        @Field({description: "사용자ID"})
        @JoinColumn({})
        user: User;

        @BeforeInsert()
        createRandomCode():void {
                this.code = Math.random().toString(34).slice(2);
        }

        toString(): string {
                return `id: ${this.id}, code: ${this.code}, user: ${this.user.nmUser}, idInsert: ${this.idInsert}, dtInsert: ${this.dtInsert}, idUpdate: ${this.idUpdate}, dtUpdate: ${this.dtUpdate}`;
        }
}