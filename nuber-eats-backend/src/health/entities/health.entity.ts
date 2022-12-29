import { Field, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, IsOptional } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@ObjectType()
@Entity()
export class HealthMarkGrp extends CoreEntity {
    @Column({comment: "건강지표 그룹명"})
    @Field({description: "건강지표 그룹명"})
    @IsString()
    nmGrpMark : string; // 건강지표 그룹명

    @Column({comment: "건강지표 타입"})
    @Field({ description: "건강지표 타입"})
    @IsString()
    tpGrp : string; // 건강지표 그룹의 타입

    @OneToMany(type=>HealthMark, (mark) => mark.grpMark, {lazy: true})
    healthMarks: HealthMark[];
}

@ObjectType()
@Entity()
export class HealthMark extends CoreEntity {

    @ManyToOne(type=>HealthMarkGrp, (grp)=>grp.healthMarks, {lazy : false})
    grpMark: HealthMarkGrp; // 건강지표 그룹

    @Column({comment: "건강지표"})
    @Field({description: "건강지표"})
    @IsString()
    nmMark: string; //건강지표

    @Column({nullable: true, comment: "건강지표(다른표기법)"})
    @Field({nullable: true, description: "건강지표(다른표기법)"})
    @IsString()
    @IsOptional()
    nmMarkOption: string; //기타명칭

    @Column({nullable: true, comment: "단위"})
    @Field({nullable: true, defaultValue: "EA", description: "단위"})
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

}

@ObjectType()
@Entity()
export class HealthRecord extends CoreEntity {

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
}
