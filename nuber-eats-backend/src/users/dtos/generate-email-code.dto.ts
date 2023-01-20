import { ObjectType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";

@ObjectType()
export class GenerateEmailCodeOutput extends CommonOutput{}