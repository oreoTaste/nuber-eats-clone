import { Field, InputType, Int, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthMark } from "../entities/health.entity";

@InputType()
export class ShowHealthMarkInput extends PartialType(HealthMark, InputType) {}

@ObjectType()
export class ShowHealthMarkOutput extends CommonOutput {
    @Field(type => [HealthMark], {nullable: true})
    healthMark?: HealthMark[];
}