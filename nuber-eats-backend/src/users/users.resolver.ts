import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { GetUsersInput, GetUsersOutput } from './dtos/get-uses.dto';
import { InsertUserGrpInput, InsertUserGrpOutput } from './dtos/insert-user-grp.dto';
import { InsertUserInput, InsertUserOutput } from './dtos/insert-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly service: UsersService) {}

    @Mutation(type => InsertUserGrpOutput)
    insertUserGrp(@Args('input') insertUserGrpInput: InsertUserGrpInput): Promise<InsertUserGrpOutput> {
        return this.service.insertUserGrp(insertUserGrpInput);
    }

    @Mutation(type => InsertUserOutput)
    insertUser(@Args('input') insertUserInput: InsertUserInput): Promise<InsertUserOutput>{
        return this.service.insertUser(insertUserInput);
    }

    @Query(type => GetUsersOutput)
    findGrpUsers(@Args('input') idUserGrp: GetUsersInput): Promise<GetUsersOutput> {
        return this.service.getUsers(idUserGrp);
    }

    @Query(type => GetUserOutput)
    findUser(@Args('input') getUserInput: GetUserInput): Promise<GetUserOutput> {
        return this.service.getUser(getUserInput);
    }
}
