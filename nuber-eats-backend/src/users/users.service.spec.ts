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
const mockJwtService = {}
const mockConfigService = {}
const mockMailService = {
  sendTemplate: jest.fn(),
}
const mockLogger = {
  log: jest.fn(),
  setContext: jest.fn(),
  error: jest.fn()
}
describe("UersService", () => {
  let userService: UsersService;
  let userRepository: MockRepository<User>;
  let userGrpRepository: MockRepository<UserGrp>;
  let emailVerificationRepository: MockRepository<EmailVerification>;
  let logger: typeof mockLogger;
  let mailService: typeof mockMailService;
  let mockUser = {email: "test email", ddBirth:'20220215', nmUser: "yk", idInsert: 1, password: "1234",
                  idUpdate: 1, healthRecords: null, checkPassword: null, ddExpire: null, dtInsert: null, 
                  dtUpdate: null, emailVerification:null, encryptPassword:null, id: 100};
  let mockUser2 = {email: "test email2", ddBirth:'20220215', nmUser: "yk2", idInsert: 1, password: "2345",
                  idUpdate: 1, healthRecords: null, checkPassword: null, ddExpire: null, dtInsert: null, 
                  dtUpdate: null, emailVerification:null, encryptPassword:null, id: 100};
  let mockUserGrp = {id: 1, nmUserGrp: "그룹몀", idInsert: 1, dtInsert: new Date(), dtUpdate: new Date(), idUpdate: 1, users: [mockUser, mockUser2]};
  beforeEach(async ()=> {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {provide: getRepositoryToken(User), useValue: mockRepository()},
        {provide: getRepositoryToken(UserGrp), useValue: mockRepository()},
        {provide: getRepositoryToken(EmailVerification), useValue: mockRepository()},
        {provide: JwtService, useValue: mockJwtService},
        {provide: Logger, useValue: mockLogger},
        {provide: ConfigService, useValue: mockConfigService},
        {provide: MailService, useValue: mockMailService},
      ]
    }).compile();
    userService = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    userGrpRepository = module.get(getRepositoryToken(UserGrp));
    emailVerificationRepository = module.get(getRepositoryToken(EmailVerification));
    mailService = module.get(MailService);
    logger = module.get(Logger);
  })
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be compiled', ()=> {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(userGrpRepository).toBeDefined();
    expect(emailVerificationRepository).toBeDefined();
    expect(mailService).toBeDefined();
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
      expect(mailService.sendTemplate).toBeCalledTimes(1);
    })
  })

  describe('searchGrpUsers', () => {
    it('should fail if coulnt find user group', async () => {
      userGrpRepository.findAndCount.mockReturnValue([[], 0]);
      let rslt = await userService.searchGrpUsers({nmUserGrp: "그룹명"});
      expect(rslt).toMatchObject({cnt: 0, reason: `couldn't found user group`});
      expect(userGrpRepository.findAndCount).toBeCalledTimes(1);
    })

    it('succeed if finds one user group', async () => {
      userGrpRepository.findAndCount.mockReturnValue([[mockUserGrp], 1]);
      logger.error.mockImplementation((...args) => {
        console.log(args)
      })
      let rslt = await userService.searchGrpUsers({nmUserGrp: "그룹명"});
      expect(rslt).toMatchObject({users: mockUserGrp.users, cnt: mockUserGrp.users.length, reason: 'ok'});
      expect(userGrpRepository.findAndCount).toBeCalledTimes(1);
    });
    
    it('succeed if finds multiple user groups', async() => {
      userGrpRepository.findAndCount.mockReturnValue([[mockUserGrp, mockUserGrp], 2]);
      logger.error.mockImplementation((...args) => {
        console.log(args)
      })
      let rslt = await userService.searchGrpUsers({nmUserGrp: "그룹명"});
      let expectReslt = [mockUserGrp, mockUserGrp].map(el => el.users).flat();
      expect(rslt).toMatchObject({users: expectReslt, cnt: expectReslt.length, reason: 'ok'});      
      expect(userGrpRepository.findAndCount).toBeCalledTimes(1);
    })
  })
  
  describe('generateEmailCode', () => {
    it('should fail if email has been verified already', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      mockAuthUser['dtEmailVerified'] = new Date();
      let rslt = await userService.generateEmailCode({...mockAuthUser, userGrp: {...mockUserGrp}});
      expect(rslt).toMatchObject({cnt: 0, reason: 'email already verified'});
    });

    it('should fail if email verification doesnt work', async () => {
      emailVerificationRepository.create.mockReturnValue({'code': '1234'});
      emailVerificationRepository.save.mockResolvedValue({'code': '1234'});
      mailService.sendTemplate.mockResolvedValue(false);
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      mockAuthUser['dtEmailVerified'] = null;
      let rslt = await userService.generateEmailCode({...mockAuthUser, userGrp: {...mockUserGrp}});
      expect(rslt).toMatchObject({cnt: 0, reason: 'error while sending email verification code'});
      expect(emailVerificationRepository.create).toBeCalledTimes(1);
      expect(emailVerificationRepository.save).toBeCalledTimes(1);
      expect(mailService.sendTemplate).toBeCalledTimes(1);
    });

    it('should succeed', async () => {
      emailVerificationRepository.create.mockReturnValue({'code': '1234'});
      emailVerificationRepository.save.mockResolvedValue({'code': '1234'});
      mailService.sendTemplate.mockResolvedValue(true);
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      mockAuthUser['dtEmailVerified'] = null;
      let rslt = await userService.generateEmailCode({...mockAuthUser, userGrp: {...mockUserGrp}});
      expect(rslt).toMatchObject({cnt: 1, reason: 'ok'});
      expect(emailVerificationRepository.create).toBeCalledTimes(1);
      expect(emailVerificationRepository.save).toBeCalledTimes(1);
      expect(mailService.sendTemplate).toBeCalledTimes(1);
    });    
  });

  it.todo('verifyEmail');
  it.todo('searchUser');
  it.todo('login');
  it.todo('findById');
  it.todo('updateProfile');
  it.todo('expireProfile');
})