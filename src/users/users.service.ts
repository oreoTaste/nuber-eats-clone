import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dto/create-users.dto';
import { UserLoginInput, UserLoginOutput } from './dto/login-users.dto';
import { Users } from './entities/users.entity';
import { JwtService } from 'src/jwt/jwt.service';

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

  async login({ email, password }: UserLoginInput): Promise<UserLoginOutput> {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user.checkPassword(password)) {
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
}
