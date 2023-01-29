import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Logger } from "src/logger/logger.service";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";
import { EmailVerification, User, UserGrp } from "./entities/user.entity";
import { UsersService } from "./users.service"

const mockRepository = {

}
type MockRepository<T=any> = Partial<Record<keyof Repository<User>, jest.Mock>>;
const mockService = {
}
const mockLogger = {
  setContext: jest.fn(),
}
describe("UersService", () => {
  let userService: UsersService;
  let userRepository: MockRepository;
  beforeEach(async ()=> {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {provide: getRepositoryToken(User), useValue: mockRepository},
        {provide: getRepositoryToken(UserGrp), useValue: mockRepository},
        {provide: getRepositoryToken(EmailVerification), useValue: mockRepository},
        {provide: JwtService, useValue: mockService},
        {provide: Logger, useValue: mockLogger},
        {provide: ConfigService, useValue: mockService},
        {provide: MailService, useValue: mockService},
      ]
    }).compile();
    userService = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  })

  it('should be compiled', ()=> {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  })
  it.todo('createAccount');
  it.todo('searchGrpUsers');
  it.todo('createAccount');
  it.todo('generateEmailCode');
  it.todo('verifyEmail');
  it.todo('searchUser');
  it.todo('login');
  it.todo('findById');
  it.todo('updateProfile');
  it.todo('expireProfile');
})