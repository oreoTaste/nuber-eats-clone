import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@InputType({isAbstract: true})
export class CoreEntity {

    @PrimaryGeneratedColumn()
    @Field(type=> Number, {nullable: false})
    @IsNumber()
    id: number;

    @CreateDateColumn({type:"timestamptz", comment: "등록일시"})
    // @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    @Field({nullable: true, description: "등록일시"})
    dtInsert: Date; //등록일

    @Column({comment: "등록자"})
    @IsNumber()
    @Field({description: "등록자"})
    idInsert: number; //등록자

    @UpdateDateColumn({type: "timestamptz", nullable: true, comment: "수정일시"})
    @IsOptional()
    @Field({nullable: true, description: "수정일시"})
    dtUpdate: Date; //수정일

    @Column({nullable: true, comment: "수정자"})
    @IsNumber()
    @Field({nullable: true, description: "수정자"})
    @IsOptional()
    idUpdate: number; //수정자

    @Column({nullable: true, comment: "상세설명"})
    @Field({nullable: true, description: "상세설명"})
    @IsString()
    @IsOptional()
    desc?: string; //상세설명
}