import {
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-users.dto';
import { Users } from './entities/users.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { LoginInput, LoginOutput } from './dto/login-users.dto';
import { EditUserInput } from './dto/edit-users.dto';
import { ProfileOutput } from './dto/profile-users.dto';
import { Verification } from './entities/verification.entity';
import { VerificationOutput } from './dto/verification.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly mailService: MailService,
  ) {}

  async findById(id: number): Promise<Users> {
    return this.usersRepository.findOne(id, {});
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOne(
        { email },
        { select: ['password', 'id'] },
      );
      if (!user) {
        // wrong id
        throw new NotFoundException(
          "Couldn't find user with the email and password given",
        );
      }
      const identical = await user.checkPassword(password);
      if (!identical) {
        // wrong password
        throw new NotFoundException(
          "Couldn't find user with the email and password given",
        );
      }
      const token = this.jwtService.sign({ id: user.id });
      return { ok: true, token };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async join(createUserInput: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exist = await this.usersRepository.findOne(
        { email: createUserInput.email },
        {},
      );
      if (exist) {
        throw new UnauthorizedException(
          'Found duplicate User of the email given',
        );
      }
      const user = await this.usersRepository.save(
        this.usersRepository.create({ ...createUserInput }),
      );
      const verification = await this.verificationRepository.save(
        this.verificationRepository.create({ user }),
      );
      if (user === undefined) {
        throw new NotImplementedException(
          "Could't save user with the infos given",
        );
      }
      this.mailService.sendVerificationEmail(
        [user.email],
        user.name,
        verification.code,
      );
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async edit(editUserInput: EditUserInput, id: number): Promise<ProfileOutput> {
    try {
      if (Object.keys(editUserInput).length <= 0) {
        throw new NotFoundException('Found Nothing to update');
      }
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        throw new NotImplementedException('Failed to edit user info');
      }

      const savedUser = await this.usersRepository.save(
        this.usersRepository.create({ ...user, ...editUserInput }),
      );
      const verification = await this.verificationRepository.findOne({
        user: savedUser,
      });
      if (editUserInput.email && verification) {
        this.mailService.sendVerificationEmail(
          [savedUser.email],
          savedUser.name,
          verification.code,
        );
      }

      return { ok: true, user: await this.usersRepository.findOne(id) };
    } catch (e) {
      return { ok: false, error: e.message, user: null };
    }
  }

  async verifyEmail(code: string): Promise<VerificationOutput> {
    const verification = await this.verificationRepository.findOne(
      { code },
      { relations: ['user'] },
    );
    try {
      if (!verification) {
        throw new NotImplementedException(
          "Couldn't find User with the verification code",
        );
      }
      verification.user.verified = true;
      await this.usersRepository.save(verification.user);

      await this.verificationRepository.delete({ id: verification.id });
      return { ok: true, user: verification.user };
    } catch (e) {
      return {
        ok: false,
        error: e.message,
      };
    }
  }

  async seeProfile(id: number): Promise<ProfileOutput> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException(
          `Couldn't find the user with the id: ${id}`,
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
}
