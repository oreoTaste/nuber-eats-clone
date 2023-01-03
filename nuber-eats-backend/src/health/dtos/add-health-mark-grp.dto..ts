import { Field, InputType, Int, ObjectType, OmitType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthMarkGrp } from "../entities/health.entity";

@InputType()
export class AddHealthMarkGrpInput extends OmitType(HealthMarkGrp, ['id'], InputType) {}

@ObjectType()
export class AddHealthMarkGrpOutput extends CommonOutput {
    @Field(type => Int, {nullable: true})
    healthMarkGrpId: number
}