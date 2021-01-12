import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-users.dto';
import { Users } from './entities/users.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { LoginInput, LoginOutput } from './dto/login-users.dto';
import { EditUserInput } from './dto/edit-users.dto';
import { ProfileOutput } from './dto/profile-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async findById(id: number): Promise<Users> {
    return this.usersRepository.findOne(id);
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOne({ email });
      const identical = await user.checkPassword(password);
      if (!user || !identical) {
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
      const user = this.usersRepository.save(
        this.usersRepository.create({ ...createUserInput }),
      );
      if (user === undefined) {
        throw new NotImplementedException(
          "Could't save user with the infos given",
        );
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async edit(editUserInput: EditUserInput, id: number): Promise<ProfileOutput> {
    try {
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        throw new NotImplementedException('Failed to edit user info');
      }
      await this.usersRepository.save(
        this.usersRepository.create({ ...user, ...editUserInput }),
      );
      return { ok: true, user: await this.usersRepository.findOne(id) };
    } catch (e) {
      return { ok: false, error: e.message, user: null };
    }
  }
}
