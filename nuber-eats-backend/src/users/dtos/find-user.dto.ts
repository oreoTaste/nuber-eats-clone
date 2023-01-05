import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CommonOutput } from "src/common/dtos/core.dto";
import { User } from "../entities/user.entity";


@InputType()
export class FindUserInput {
    @Field(type => Int)
    idUser: number;
}

@ObjectType()
export class FindUserOutput extends CommonOutput{
    @Field(type => User, {nullable:true})
    user?: User;
}
