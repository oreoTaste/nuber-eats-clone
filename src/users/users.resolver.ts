import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dto/create-users.dto';
import { UserLoginInput, UserLoginOutput } from './dto/login-users.dto';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserLoginOutput)
  async loginUsers(
    @Args('UserLoginInput') userLoginInput: UserLoginInput,
  ): Promise<UserLoginOutput> {
    return await this.usersService.login(userLoginInput);
  }

  @Mutation(() => CreateUserOutput)
  async joinUsers(
    @Args('CreateUserInput') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return await this.usersService.join(createUserInput);
  }

  @Query(() => Users)
  me(@Context() context) {
    if (context.hasOwnProperty('user')) {
      return context['user'];
    } else return null;
  }
}
