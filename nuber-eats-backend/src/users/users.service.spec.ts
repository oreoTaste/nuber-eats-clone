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
  update: jest.fn(),
})
type MockRepository<T=any> = Partial<Record<keyof Repository<User>, jest.Mock>>;
const mockJwtService = {
  sign: jest.fn(),
}
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
  let jwtService: typeof mockJwtService;
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
    jwtService = module.get(JwtService);
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
        // console.log(args)
      })
      let rslt = await userService.searchGrpUsers({nmUserGrp: "그룹명"});
      expect(rslt).toMatchObject({users: mockUserGrp.users, cnt: mockUserGrp.users.length, reason: 'ok'});
      expect(userGrpRepository.findAndCount).toBeCalledTimes(1);
    });
    
    it('succeed if finds multiple user groups', async() => {
      userGrpRepository.findAndCount.mockReturnValue([[mockUserGrp, mockUserGrp], 2]);
      logger.error.mockImplementation((...args) => {
        // console.log(args)
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

  describe('verifyEmail', () => {
    it('should fail if no authUser input', async () => {
      let any:any;
      any = {};
      let rslt = await userService.verifyEmail(any, {code: '1234'});
      expect(rslt).toMatchObject({cnt: 0, reason: 'invalid user'});
    });

    it('should fail if email has been verified', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      mockAuthUser.dtEmailVerified = new Date();
      let rslt = await userService.verifyEmail(mockAuthUser, {code: '1234'});
      expect(rslt).toMatchObject({cnt: 0, reason: 'already verified'});
    });
    it('should fail if input code is different', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      emailVerificationRepository.findOne.mockResolvedValue({code: '1111'});
      let rslt = await userService.verifyEmail(mockAuthUser, {code: '1234'});
      expect(rslt).toMatchObject({cnt: 0, reason: 'wrong code input'});
      expect(emailVerificationRepository.findOne).toBeCalledTimes(1);
    });

    it('should succeed', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      emailVerificationRepository.findOne.mockResolvedValue({code: '1234'});
      emailVerificationRepository.save.mockResolvedValue({});
      userRepository.update.mockResolvedValue({});
      let rslt = await userService.verifyEmail(mockAuthUser, {code: '1234'});
      expect(rslt).toMatchObject({cnt: 1, reason: 'ok'});
      expect(emailVerificationRepository.findOne).toBeCalledTimes(1);
      expect(emailVerificationRepository.save).toBeCalledTimes(1);
      expect(userRepository.update).toBeCalledTimes(1);
    })
  });

  describe('searchUser', () => {
    it('should fail if no user found', async () => {
      userRepository.findAndCount.mockResolvedValue([null, 0]);
      let rslt = await userService.searchUser({idUserGrp: 1, idUser: 1, nmUser: "name"});
      expect(rslt).toMatchObject({cnt: 0, reason: "no user found for the id", user: null});
    });
    
    it('should succeed if one or more users found', async () => {
      userRepository.findAndCount.mockResolvedValue([[mockUser, mockUser, mockUser, mockUser, mockUser], 5]);
      let rslt = await userService.searchUser({idUserGrp: 1, idUser: 1, nmUser: "name"});
      expect(rslt).toMatchObject({cnt:5, reason: "ok", user: [mockUser, mockUser, mockUser, mockUser, mockUser]});
    })
  })

  describe('login', () => {
    it('should fail if no user found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      let rslt = await userService.login({email: "", password: ""});
      expect(rslt).toMatchObject({cnt: 0, reason: "wrong information1"});
    });

    it('should fail if the found user account is expired ', async () => {
      mockUser.ddExpire = "20000101";
      userRepository.findOne.mockResolvedValue(mockUser);
      let rslt = await userService.login({email: "", password: ""});
      expect(rslt).toMatchObject({cnt: 0, reason: 'the account is expired'});
    })

    it('should fail if password wrong', async () => {
      mockUser.ddExpire = new Date(new Date().setDate(new Date().getDate()+1))
                                  .toLocaleDateString('ko').split(/[\. ]+/g).map(el => Number(el) < 10? '0'+el: ''+el).slice(0, -1).join('');
      mockUser.checkPassword = (password) => false;
      userRepository.findOne.mockResolvedValue(mockUser);
      let rslt = await userService.login({email: "", password: ""});
      expect(rslt).toMatchObject({cnt: 0, reason: "wrong  information2"});
    })
    it('should succeed', async () => {
      mockUser.ddExpire = new Date(new Date().setDate(new Date().getDate()+1))
                                  .toLocaleDateString('ko').split(/[\. ]+/g).map(el => Number(el) < 10? '0'+el: ''+el).slice(0, -1).join('');
      mockUser.checkPassword = (password) => true;
      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(true);
      jwtService.sign.mockReturnValue("12345");
      let rslt = await userService.login({email: "", password: ""});
      expect(rslt).toMatchObject({cnt: 0, reason: "ok", token: "12345"});
    });
  })
  describe('findById', () => {
    it('should fail if no user found ', async () => {
      userRepository.findOne.mockResolvedValue(null);
      let rslt = await userService.findById(1);
      expect(rslt).toBeNull();
    });
    it('should succeed if a user found', async () => {
      let mockUserData: any;
      mockUserData = {};
      Object.assign(mockUserData, mockUser);
      userRepository.findOne.mockResolvedValue(mockUserData);
      let rslt = await userService.findById(1);
      expect(rslt).toMatchObject(mockUserData);
    });
  });

  describe('updateProfile', () => {
    it('should fail if authUser not found', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      let rslt = await userService.updateProfile(mockAuthUser, {});
      expect(rslt).toMatchObject({cnt: 0, reason: 'invalid user'});
    });
    it('should fail if failed to update profile.', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      userRepository.save.mockResolvedValue(null)
      let rslt = await userService.updateProfile(mockAuthUser, {});
      expect(rslt).toMatchObject({cnt: 0, reason: 'failed to update profile'});
    })

    it('should generate email code if different email input', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      mockUser['dtEmailVerified'] = new Date();
      Object.assign(mockAuthUser, mockUser);
      userRepository.save.mockResolvedValue(mockAuthUser);
      userRepository.update.mockResolvedValue({});
      const spyMethod = jest.spyOn(userService, 'generateEmailCode');

      await userService.updateProfile(mockAuthUser, {email: "different email"});
      expect(spyMethod).toBeCalledTimes(1);
    });

    it('should succeed', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      userRepository.save.mockResolvedValue(mockAuthUser);
      let rslt = await userService.updateProfile(mockAuthUser, {email: mockUser.email});
      expect(rslt).toMatchObject({cnt: 1, reason: 'ok'})
    });
  });

  describe('expireProfile', () => {
    it('should fail if authUser unidentified', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      let rslt = await userService.expireProfile(mockAuthUser, {email: mockAuthUser.email});
      expect(rslt).toMatchObject({cnt: 0, reason: 'invalid user'});
    })
    it('should fail if input email is null', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      let rslt = await userService.expireProfile(mockAuthUser, {email: null});
      expect(rslt).toMatchObject({cnt: 0, reason: 'invalid user'});
    })
    it('should fail if input email is not others email', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      Object.assign(mockAuthUser, mockUser);
      let rslt = await userService.expireProfile(mockAuthUser, {email: "other email"});
      expect(rslt).toMatchObject({cnt: 0, reason: `cannot expire other user`});
    })
    it('should fail if user already expired', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      mockUser.ddExpire = null;
      Object.assign(mockAuthUser, mockUser);
      let rslt = await userService.expireProfile(mockAuthUser, {email: mockAuthUser.email});
      expect(rslt).toMatchObject({cnt: 0, reason: `already expired`});
    })
    it('should sucess', async () => {
      let mockAuthUser: any;
      mockAuthUser = {};
      let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
                                        .toLocaleDateString('ko', {dateStyle: 'medium'})
                                        .replace(/\./g,'')
                                        .split(' ')
                                        .reduce((acc,val) => acc + (Number(val) < 10 ? '0'+val: val));
      mockUser.ddExpire = tomorrow;
      Object.assign(mockAuthUser, mockUser);
      userRepository.save.mockResolvedValue("ok");
      let rslt = await userService.expireProfile(mockAuthUser, {email: mockAuthUser.email});
      expect(rslt).toMatchObject({cnt: 1, reason: 'ok'});
      expect(userRepository.save).toBeCalledTimes(1);
    })
  });
})