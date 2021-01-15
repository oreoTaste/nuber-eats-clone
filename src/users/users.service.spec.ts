import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

const mockJwtService = {
  sign: jest.fn(() => 'token'),
  verify: jest.fn(),
};
const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<
  Record<keyof Repository<Users>, jest.Mock>
>;

describe('UserService', () => {
  let usersService: UsersService;
  let mailService: MailService;
  let usersRepository: MockRepository;
  let verificationRepository: MockRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get(getRepositoryToken(Users));
    verificationRepository = module.get(getRepositoryToken(Verification));
  });

  enum UserRole {
    'host',
    'listener',
  }

  const createAccountArgs = {
    email: 'email',
    password: 'password',
    role: UserRole.host,
    name: 'name',
  };

  describe('join', () => {
    it('be defined', () => {
      expect(usersService).toBeDefined();
    });

    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'email',
      });
      const result = await usersService.join(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'Found duplicate User of the email given',
      });
    });

    it('should succeed if user doesnt exist', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);
      verificationRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      verificationRepository.save.mockResolvedValue({
        code: '12345679',
        user: createAccountArgs,
      });
      const result = await usersService.join(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(usersRepository.save).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error("couldn't find one"));
      const result = await usersService.join(createAccountArgs);
      expect(result).toEqual({ ok: false, error: "couldn't find one" });
    });
  });

  const loginAccountArgs = {
    email: 'email',
    password: 'password',
  };

  describe('login', () => {
    it('should fail if user doesnt exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await usersService.login(loginAccountArgs);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: "Couldn't find user with the email and password given",
      });
    });

    it('should fail if passsword wrong', async () => {
      const mockUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.login(loginAccountArgs);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: "Couldn't find user with the email and password given",
      });
    });

    it('should return token if user exist & password correct', async () => {
      const mockUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await usersService.login(loginAccountArgs);
      expect(result).toEqual({
        ok: true,
        token: 'token',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findById', () => {
    it('should fail if id is incorrect', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const result = await usersService.findById(null);
      expect(result).toEqual(null);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
    });
    it('should succeed if id is correct', async () => {
      usersRepository.findOne.mockResolvedValue(createAccountArgs);
      const result = await usersService.findById(1);

      expect(result).toEqual(createAccountArgs);
    });
  });

  describe('editProfile', () => {
    it('should fail if id is incorrect', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const result = await usersService.edit({ email: 'email revised' }, 1);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ok: false,
        error: 'Failed to edit user info',
        user: null,
      });
    });
    it('should succeed with sendVerificationEmail if email is to be edited', async () => {
      usersRepository.findOne.mockResolvedValue(createAccountArgs);
      usersRepository.save.mockReturnValue(createAccountArgs);
      verificationRepository.findOne.mockResolvedValue({ code: 'code' });
      const result = await usersService.edit({ email: 'email revised' }, 1);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(2);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.findOne).toHaveBeenCalledTimes(1);

      expect(result).toEqual({ ok: true, user: createAccountArgs });
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(String),
        expect.any(String),
      );
    });
  });

  describe('verifyEmail', () => {
    it('should fail if code is invalid', async () => {
      verificationRepository.findOne.mockResolvedValue(null);
      const result = await usersService.verifyEmail('123456789');
      expect(verificationRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: "Couldn't find User with the verification code",
      });
    });
    it('should succeed with update verification, user repository if code is valid', async () => {
      const verification = {
        id: 1,
        user: { id: 1, name: 'YK', email: 'email', verified: false },
      };
      verificationRepository.findOne.mockResolvedValue(verification);
      const result = await usersService.verifyEmail('123456789');
      expect(verification.user.verified).toEqual(true);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(expect.any(Object));
      expect(verificationRepository.delete).toHaveBeenCalledTimes(1);
      expect(verificationRepository.delete).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result).toEqual({ ok: true, user: verification.user });
    });
  });
});
