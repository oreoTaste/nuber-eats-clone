import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserInput, CreateUserOutput } from './dto/create-users.dto';
import { EditUserInput } from './dto/edit-users.dto';
import { LoginInput, LoginOutput } from './dto/login-users.dto';
import { ProfileInput, ProfileOutput } from './dto/profile-users.dto';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => LoginOutput)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginOutput> {
    return await this.usersService.login(loginInput);
  }

  @Mutation(() => CreateUserOutput)
  async createAccount(
    @Args('CreateUserInput') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return await this.usersService.join(createUserInput);
  }

  @Query(() => ProfileOutput)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser): ProfileOutput {
    if (authUser) {
      return { ok: true, user: authUser };
    } else
      return { ok: false, error: '사용자정보가 옳지 않습니다', user: null };
  }

  @Query(() => ProfileOutput)
  @UseGuards(AuthGuard)
  async seeProfile(
    /*@Context() context*/ @Args() profileInput: ProfileInput,
  ): Promise<ProfileOutput> {
    try {
      return {
        ok: true,
        user: await this.usersService.findById(profileInput.id),
      };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  @Mutation(() => ProfileOutput)
  editProfile(
    @Args('EditUserInput') editUserInput: EditUserInput,
    @Context() context,
  ): Promise<ProfileOutput> {
    return this.usersService.edit(editUserInput, context);
  }
}
