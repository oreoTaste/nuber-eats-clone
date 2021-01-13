import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserInput, CreateUserOutput } from './dto/create-users.dto';
import { EditUserInput } from './dto/edit-users.dto';
import { LoginInput, LoginOutput } from './dto/login-users.dto';
import { ProfileInput, ProfileOutput } from './dto/profile-users.dto';
import { VerificationInput, VerificationOutput } from './dto/verification.dto';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => Users)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => LoginOutput)
  login(@Args('loginInput') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation(() => CreateUserOutput)
  createAccount(
    @Args('CreateUserInput') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.join(createUserInput);
  }

  @Query(() => ProfileOutput)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser): ProfileOutput {
    return { ok: Boolean(authUser), user: authUser };
  }

  @Query(() => ProfileOutput)
  @UseGuards(AuthGuard) // 로그인 되어있는지 확인
  seeProfile(@Args() profileInput: ProfileInput): Promise<ProfileOutput> {
    return this.usersService.seeProfile(profileInput.id);
  }

  @Mutation(() => ProfileOutput)
  @UseGuards(AuthGuard) // 로그인 되어있는지 확인
  editProfile(
    @Args('EditUserInput') editUserInput: EditUserInput,
    @AuthUser() authUser,
  ): Promise<ProfileOutput> {
    return this.usersService.edit(editUserInput, authUser.id);
  }

  @Mutation(() => VerificationOutput)
  verifyEmail(
    @Args('VerificationInput') verificationInput: VerificationInput,
  ): Promise<VerificationOutput> {
    return this.usersService.verifyEmail(verificationInput.code);
  }
}
