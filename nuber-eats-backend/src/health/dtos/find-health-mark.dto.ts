import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { HealthMark } from "../entities/health.entity";

@InputType()
export class FindHealthMarkInput extends PartialType(HealthMark, InputType) {}

@ObjectType()
export class FindHealthMarkOutput extends CommonOutput {
    @Field(type => [HealthMark], {nullable: true})
    healthMark?: HealthMark[];
}