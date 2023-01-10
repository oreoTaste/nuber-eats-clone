import { Field, InputType, Int, ObjectType, OmitType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthMarkGrp } from "../entities/health.entity";

@InputType()
export class CreateHealthMarkGrpInput extends OmitType(HealthMarkGrp, ['id'], InputType) {}

@ObjectType()
export class CreateHealthMarkGrpOutput extends CommonOutput {
    @Field(type => Int, {nullable: true})
    idHealthMarkGrp: number
}