import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User } from "../entities/user.entity";


@InputType()
export class GetUserInput extends PickType(User, ['id'], InputType){}

@ObjectType()
export class GetUserOutput extends CommonOutput{
    @Field(type => User, {nullable:true})
    user?: User;
}
