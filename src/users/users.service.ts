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
      if (!user || !user.checkPassword(password)) {
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

  async edit(editUserInput: EditUserInput, context): Promise<ProfileOutput> {
    const id = context['user']['id'];
    const user = await this.usersRepository.findOne(id);
    try {
      const result = (
        await this.usersRepository.update(user.id, { ...editUserInput })
      ).affected;
      if (result <= 0) {
        throw new NotImplementedException('Failed to edit user info');
      }
      return { ok: true, user: await this.usersRepository.findOne(id) };
    } catch (e) {
      return { ok: false, error: e.message, user: null };
    }
  }
}
