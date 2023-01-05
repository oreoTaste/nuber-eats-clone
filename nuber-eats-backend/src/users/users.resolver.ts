import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddUserGrpInput, AddUserGrpOutput } from './dtos/add-user-grp.dto';
import { AddUserInput, AddUserOutput } from './dtos/add-user.dto';
import { FindUserInput, FindUserOutput } from './dtos/find-user.dto';
import { FindGrpUsersInput, FindGrpUsersOutput } from './dtos/find-grp-uses.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly service: UsersService) {}

    @Mutation(type => AddUserGrpOutput)
    addUserGrp(@Args('input') input: AddUserGrpInput): Promise<AddUserGrpOutput> {
        return this.service.addUserGrp(input);
    }

    @Mutation(type => AddUserOutput)
    addUser(@Args('input') input: AddUserInput): Promise<AddUserOutput>{
        return this.service.addUser(input);
    }

    @Query(type => FindGrpUsersOutput)
    findGrpUsers(@Args('input') input: FindGrpUsersInput): Promise<FindGrpUsersOutput> {
        return this.service.findGrpUsers(input);
    }

    @Query(type => FindUserOutput)
    findUser(@Args('input') input: FindUserInput): Promise<FindUserOutput> {
        return this.service.findUser(input);
    }
}
