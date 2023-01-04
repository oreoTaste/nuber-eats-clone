import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthRecord } from "../entities/health.entity";

@InputType()
export class ShowHealthRecordInput {
    @Field(type => Int)
    idUser: number;

    @Field(type => Int)
    idHealthRecord: number;

    @Field({nullable: true})
    dtRecordStart?: Date;

    @Field({nullable: true})
    dtRecordEnd?: Date;

}

@ObjectType()
export class ShowHealthRecordOutput extends CommonOutput{
    @Field(type => [HealthRecord], {nullable: true})
    healthRecord?: HealthRecord[];
}