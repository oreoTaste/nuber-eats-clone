import { InputType, ObjectType, PickType } from "@nestjs/graphql"
import { CommonOutput } from "src/common/dtos/core.dto"
import { EmailVerification } from "../entities/user.entity"

@InputType()
export class VerifyEmailInput extends PickType(EmailVerification, ['code'], InputType){}

@ObjectType()
export class VerifyEmailOutput extends CommonOutput {}