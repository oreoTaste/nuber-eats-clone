import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, IsOptional, IsEnum, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { CoreInterface } from "src/common/entities/core.interface";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// @ObjectType({isAbstract: true})
// @ArgsType()
@ObjectType()
@InputType("HealthMarkGrpInput", {isAbstract: true})
@Entity()
export class HealthMarkGrp extends CoreEntity implements CoreInterface{
    @PrimaryGeneratedColumn({name: "ID_HEALTH_MARK_GRP", primaryKeyConstraintName: "PK_HEALTH_MARK_GRP"})
    @Field(type=> Int, {nullable: false})
    @IsNumber()
    id: number;

    @Column({comment: "건강지표 그룹명"})
    @Field({description: "건강지표 그룹명"})
    @IsString()
    @Length(1)
    nmGrpMark : string; // 건강지표 그룹명

    @Column({comment: "건강지표 그룹타입"})
    @Field({ description: "건강지표 그룹타입"})
    @IsString()
    tpGrp : string; // 건강지표 그룹의 타입

    @OneToMany(type=>HealthMark
            , (mark) => mark.grpMark
            , {lazy: true, nullable: true, createForeignKeyConstraints: false, orphanedRowAction: "disable", onDelete: "NO ACTION", onUpdate: "CASCADE"})
    healthMarks: HealthMark[];
}

export enum Severity {
    NONE, MILD, MODERATE, SEVERE
}
// @ObjectType({isAbstract: true})
// @ArgsType()
@ObjectType()
@InputType("HealthMarkInput", {isAbstract: true})
@Entity()
export class HealthMark extends CoreEntity implements CoreInterface{
    @PrimaryGeneratedColumn({name: "ID_HEALTH_MARK", primaryKeyConstraintName: "PK_HEALTH_MARK"})
    @Field(type=> Int, {nullable: false})
    @IsNumber()
    id: number;

    @ManyToOne(type=>HealthMarkGrp
            , (grp)=>grp.healthMarks
            , {lazy : false, nullable: true, createForeignKeyConstraints: false, orphanedRowAction: "disable", onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @JoinColumn({ name: "ID_HEALTH_MARK_GRP" })
    @Field({nullable: true})
    @IsOptional()
    grpMark: HealthMarkGrp; // 건강지표 그룹

    @Column({name: "NM_MARK", comment: "건강지표"})
    @Field({description: "건강지표"})
    @IsString()
    @Length(1,)
    nmMark: string; //건강지표

    @Column({nullable: true, comment: "건강지표(다른표기법)"})
    @Field({nullable: true, description: "건강지표(다른표기법)"})
    @IsString()
    @IsOptional()
    nmMarkOption: string; //기타명칭

    @Column({nullable: true, comment: "단위", default: "EA"})
    @Field({nullable: true, description: "단위"})
    @IsString()
    @IsOptional()
    unit?: string; //단위

    @Column({nullable: true, comment: "정상기준(이상)"})
    @Field({nullable: true, description: "정상기준(이상)"})
    @IsNumber()
    @IsOptional()
    strNormal?: number; //정상기준(이상)

    @Column({nullable: true, comment: "정상기준(이하)"})
    @Field({nullable: true, description: "정상기준(이하)"})
    @IsNumber()
    @IsOptional()
    endNormal?: number; //정상기준(이하)

    @Column({enum: Severity, default: Severity.MILD, comment: "중요도"})
    @Field({description: "중요도", nullable: true})
    @IsEnum(Severity)
    @IsOptional()
    severity: Severity; //중요도

    @OneToMany(type=>HealthRecord, (record) => record.healthMark, {lazy: true})
    healthRecord: HealthRecord[];
}


@ObjectType()
@InputType("HealthRecordInput", {isAbstract: true})
@Entity()
export class HealthRecord extends CoreEntity implements CoreInterface{
    @PrimaryGeneratedColumn({name: "ID_HEALTH_RECORD", primaryKeyConstraintName: "PK_HEALTH_RECORD"})
    @Field(type=> Int, {nullable: false})
    @IsNumber()
    id: number;

    @ManyToOne(type=>HealthMark
            , (healthMark)=>healthMark.healthRecord
            , {lazy : false, nullable: true, createForeignKeyConstraints: false, orphanedRowAction: "disable", onDelete: "NO ACTION", onUpdate: "CASCADE"})
    healthMark: HealthMark; // 건강지표 그룹

    @ManyToOne(type=>User
            , (user)=>user.healthRecord
            , {lazy: false, nullable: true, createForeignKeyConstraints: false, orphanedRowAction: "disable", onDelete: "NO ACTION", onUpdate: "CASCADE"})
    @Field(type=>User, {nullable: true})
    user: User;

    @Column({comment: "기록타입"})
    @Field({description: "기록타입"})
    @IsNumber()
    tpRecord: number;

    @Column({nullable: true, comment: "기록값(숫자)"})
    @Field({nullable: true, description: "기록값(숫자)"})
    @IsNumber()
    record1: number;

    @Column({nullable: true, comment: "기록값(문자)"})
    @Field({nullable: true, description: "기록값(문자)"})
    @IsString()
    @IsOptional()
    record2: string;

    @Column({ type: 'char', length:8, default: () => "TO_CHAR(NOW(), 'YYYYMMDD')", comment: "건강기록 측정일"})
    @Field({nullable: true, description: "건강기록 측정일"})
    @Length(8,8)
    @IsString()
    @IsOptional()
    ddRegister: string; //건강기록 측정일
}
