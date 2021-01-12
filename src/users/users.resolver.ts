import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
    return { ok: Boolean(authUser), user: authUser };
  }

  @Query(() => ProfileOutput)
  @UseGuards(AuthGuard) // 로그인 되어있는지 확인
  async seeProfile(@Args() profileInput: ProfileInput): Promise<ProfileOutput> {
    try {
      const user = await this.usersService.findById(profileInput.id);
      if (!user) {
        throw new NotFoundException(
          `Couldn't find the user with the id: ${profileInput.id}`,
        );
      }
      return {
        ok: Boolean(user),
        user: user,
      };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  @Mutation(() => ProfileOutput)
  @UseGuards(AuthGuard) // 로그인 되어있는지 확인
  async editProfile(
    @Args('EditUserInput') editUserInput: EditUserInput,
    @AuthUser() AuthUser,
  ): Promise<ProfileOutput> {
    try {
      return await this.usersService.edit(editUserInput, AuthUser.id);
    } catch (e) {
      return { ok: false, error: e.message, user: null };
    }
  }
}
