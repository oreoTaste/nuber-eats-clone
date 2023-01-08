import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SearchUserInput, SearchUserOutput } from './dtos/search-user.dto';
import { SearchGrpUsersInput, SearchGrpUsersOutput } from './dtos/search-grp-uses.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly service: UsersService) {}

    /** 
     * @description: 계정생성 (사용자 그룹 검색/생성 -> 사용자 생성)
    */
    @Mutation(type => CreateAccountOutput)
    createAccount(@Args('input')input: CreateAccountInput): Promise<CreateAccountOutput> {
        return this.service.createAccount(input);
    }

    /** 
     * @description: 그룹내 사용자 조회 (사용자 그룹 검색 -> 사용자 조회)
    */    
    @Query(type => SearchGrpUsersOutput)
    searchGrpUsers(@Args('input') input: SearchGrpUsersInput): Promise<SearchGrpUsersOutput> {
        return this.service.searchGrpUsers(input);
    }

    /** 
     * @description: 사용자 조회 (사용자 검색)
    */
    @Query(type => SearchUserOutput)
    searchUser(@Args('input') input: SearchUserInput): Promise<SearchUserOutput> {
        return this.service.searchUser(input);
    }

}
