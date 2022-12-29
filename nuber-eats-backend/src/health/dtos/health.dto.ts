import { ArgsType, Field, InputType, ObjectType, OmitType, PartialType } from "@nestjs/graphql";
import { HealthMark, HealthRecord } from "../entities/health.entity";

@InputType()
export class HealthMarkInput extends OmitType(HealthMark, ['id'], InputType) {
}

@ObjectType()
export class HealthMarkOutput extends PartialType(HealthMark, ObjectType) {
}

@ArgsType()
export class HealthMarkArgs extends OmitType(HealthMark, ['id'], ArgsType) {
}

@InputType()
export class HealthRecordInput extends OmitType(HealthRecord, ['id'], InputType) {
}

@ObjectType()
export class HealthRecordOutput extends PartialType(HealthRecord, ObjectType) {
}

@ArgsType()
export class HealthRecordArgs extends OmitType(HealthRecord, ['id'], ArgsType) {
}