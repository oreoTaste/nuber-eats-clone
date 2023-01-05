import { Field, InputType, Int, ObjectType, OmitType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthRecord } from "../entities/health.entity";

@InputType()
export class AddHealthRecordInput extends OmitType(HealthRecord, ['id'], InputType) {
    @Field(type => Int)
    idUser: number;
    
    @Field(type => Int)
    idHealthMark: number;
}

@ObjectType()
export class AddHealthRecordOutput extends CommonOutput{
    @Field(type => Int, {nullable: true})
    idHealthRecord?: number;
}