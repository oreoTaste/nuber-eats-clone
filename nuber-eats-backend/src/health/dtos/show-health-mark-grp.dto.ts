import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthMarkGrp } from "../entities/health.entity";

@InputType()
export class ShowHealthMarkGrpInput extends PartialType(HealthMarkGrp, InputType) {}

@ObjectType()
export class ShowHealthMarkGrpOutput extends CommonOutput {
    @Field(type => [HealthMarkGrp], {nullable: true})
    healthMarkGrp: HealthMarkGrp[];
}