import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthMarkGrp } from "../entities/health.entity";

@InputType()
export class FindHealthMarkGrpInput extends PartialType(HealthMarkGrp, InputType) {}

@ObjectType()
export class FindHealthMarkGrpOutput extends CommonOutput {
    @Field(type => [HealthMarkGrp], {nullable: true})
    healthMarkGrp: HealthMarkGrp[];
}