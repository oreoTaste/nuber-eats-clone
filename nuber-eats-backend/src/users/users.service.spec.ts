import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Logger } from "src/logger/logger.service";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";
import { EmailVerification, User, UserGrp } from "./entities/user.entity";
import { UsersService } from "./users.service"

const mockRepository = () => ({
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
})
type MockRepository<T=any> = Partial<Record<keyof Repository<User>, jest.Mock>>;
const mockService = {
  sendTemplate: jest.fn(),
}
const mockLogger = {
  setContext: jest.fn(),
  error: jest.fn()
}
describe("UersService", () => {
  let userService: UsersService;
  let userRepository: MockRepository<User>;
  let userGrpRepository: MockRepository<UserGrp>;
  let emailVerificationRepository: MockRepository<EmailVerification>;
  let mailService: typeof mockService;
  let mockUser = {email: "test email", ddBirth:'20220215', nmUser: "yk", idInsert: 1, password: "1234",
                  idUpdate: 1, healthRecords: null, checkPassword: null, ddExpire: null, dtInsert: null, 
                  dtUpdate: null, emailVerification:null, encryptPassword:null, id: 100};
  beforeEach(async ()=> {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {provide: getRepositoryToken(User), useValue: mockRepository()},
        {provide: getRepositoryToken(UserGrp), useValue: mockRepository()},
        {provide: getRepositoryToken(EmailVerification), useValue: mockRepository()},
        {provide: JwtService, useValue: mockService},
        {provide: Logger, useValue: mockLogger},
        {provide: ConfigService, useValue: mockService},
        {provide: MailService, useValue: mockService},
      ]
    }).compile();
    userService = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    userGrpRepository = module.get(getRepositoryToken(UserGrp));
    emailVerificationRepository = module.get(getRepositoryToken(EmailVerification));
    mailService = module.get(MailService);
  })

  it('should be compiled', ()=> {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  })
  describe('createAccount', () => {
    it('should fail if user exists', async () => {
      userRepository.findOne.mockResolvedValue({
        email: "test email",
        id: 1,
      });
      let rslt = await userService.createAccount(mockUser);
      expect(rslt).toMatchObject({cnt: 0, reason: 'found user with the email', idUser: null});
    });
    it('should fail if multiple user groups exists', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userGrpRepository.findAndCount.mockResolvedValue([[new UserGrp(), new UserGrp()],2]);
      let rslt = await userService.createAccount(mockUser);
      expect(rslt).toMatchObject({cnt:0, reason: 'found multiple user groups while creating account'});
    });
    it('should fail if one user group found but the user exists', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);
      userGrpRepository.findAndCount.mockResolvedValue([[new UserGrp()],1]);
      userRepository.findOne.mockResolvedValue(new User());
      let rslt = await userService.createAccount(mockUser);
      expect(rslt).toMatchObject({cnt: 0, reason: 'found user already with the name and the birthdate', idUser: null});
    });
    it('should succeed', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userGrpRepository.findAndCount.mockResolvedValue([[new UserGrp()],1]);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      emailVerificationRepository.create.mockReturnValue({code: 'code'});
      emailVerificationRepository.save.mockResolvedValue({code: 'code'});
      mailService.sendTemplate.mockResolvedValue(true);
      let rslt = await userService.createAccount(mockUser);
      expect(rslt).toMatchObject({cnt: 1, reason: 'ok', idUser: mockUser.id});
      expect(userGrpRepository.findAndCount).toBeCalledTimes(1);
      expect(userGrpRepository.save).toBeCalledTimes(0);
      expect(userRepository.findOne).toBeCalledTimes(2);
      expect(userRepository.save).toBeCalledTimes(1);
      expect(userRepository.create).toBeCalledTimes(1);
      expect(emailVerificationRepository.save).toBeCalledTimes(1);
      expect(emailVerificationRepository.create).toBeCalledTimes(1);
    })
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