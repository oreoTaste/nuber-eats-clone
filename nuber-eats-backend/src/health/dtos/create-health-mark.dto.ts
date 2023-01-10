import { Field, InputType, Int, ObjectType, OmitType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthMark } from "../entities/health.entity";

@InputType()
export class CreateHealthMarkInput extends OmitType(HealthMark, ['id'], InputType) {
    @Field(type => Int)
    idHealthMarkGrp: number;
}

@ObjectType()
export class CreateHealthMarkOutput extends CommonOutput {
    @Field(type => Int, {nullable: true})
    idHealthMark?: number
}