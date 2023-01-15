import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SearchUserInput, SearchUserOutput } from './dtos/search-user.dto';
import { SearchGrpUsersInput, SearchGrpUsersOutput } from './dtos/search-grp-uses.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common'
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UpdateProfileInput, UpdateProfileOutput } from './dtos/update-profile.dto';
import { ExpireProfileInput, ExpireProfileOutput } from './dtos/expire-profile.dto';

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
    @UseGuards(AuthGuard)
    searchUser(@Args('input') input: SearchUserInput): Promise<SearchUserOutput> {
        return this.service.searchUser(input);
    }

    /**
     * @description: 로그인
     */
    @Query(type => LoginOutput)
    login(@Args('input') input: LoginInput): Promise<LoginOutput> {
        return this.service.login(input);
    }

    @Query(type => User)
    // @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User): User {
        return authUser;
    }

    @Mutation(type => UpdateProfileOutput)
    @UseGuards(AuthGuard)
    updateProfile(@AuthUser() authUser: User
                , @Args('input') input: UpdateProfileInput): Promise<UpdateProfileOutput>{
        return this.service.updateProfile(authUser.id, input);
    }

    @Mutation(type => ExpireProfileOutput)
    expireProfile(@AuthUser() authUser: User
                , @Args('input') input: ExpireProfileInput): Promise<ExpireProfileOutput>{
        return this.service.expireProfile(authUser.id, input);
    }
}
