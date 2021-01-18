import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from 'src/users/entities/verification.entity';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

describe('UserModule (e2e)', () => {
  let testId: number;
  let verification: Verification;
  let app: INestApplication;
  let jwtToken: string;
  let usersRepository: Repository<Users>;
  let verificationRepository: Repository<Verification>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get(getRepositoryToken(Users));
    verificationRepository = module.get(getRepositoryToken(Verification));
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
  describe('createAccount', () => {
    it('should create an account', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
          mutation {
            createAccount(CreateUserInput: {
              email:"youngkuk.sohn@gmail.com",
              name: "YK",
              password:"1234",
              role:host
            }) {
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toEqual(true);
          expect(res.body.data.createAccount.error).toEqual(null);
        });
    });
    it('should fail if there account already', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
        mutation {
          createAccount(CreateUserInput: {
            email:"youngkuk.sohn@gmail.com",
            name: "YK",
            password:"1234",
            role:host
        }) {
          ok,
          error
          }
        }
        `,
        })
        .expect(200)
        .expect((resp) => {
          expect(resp.body.data.createAccount.ok).toEqual(false);
          expect(resp.body.data.createAccount.error).toEqual(
            'Found duplicate User of the email given',
          );
        });
    });
  });

  describe('login', () => {
    it('should succeed login', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: ` {
            login(loginInput:{
              email:"youngkuk.sohn@gmail.com"
              password:"1234"
            }) {
              token,
              ok,
              error
            }
          } 
          `,
        })
        .expect(200)
        .expect((resp) => {
          const {
            login: { token, ok, error },
          } = resp.body.data;
          expect(token).toEqual(expect.any(String));
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          jwtToken = token;
        });
    });
    it('should fail if wrong password', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{
          login(loginInput:{
            email:"youngkuk.sohn@gmail.com"
            password:"wrong!!!"
          }) {
            token,
            ok,
            error
          } 
        }`,
        })
        .expect(200)
        .expect((resp) => {
          const {
            login: { token, ok, error },
          } = resp.body.data;
          expect(token).toEqual(null);
          expect(ok).toEqual(false);
          expect(error).toEqual(
            "Couldn't find user with the email and password given",
          );
        });
    });
  });

  describe('seeProfile', () => {
    beforeAll(async () => {
      testId = (await usersRepository.findOne()).id;
    });

    it('should succeed searching valid id with valid token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('jwt', jwtToken)
        .send({
          query: ` {
          seeProfile(id: ${testId}){
            ok,
            error,
            user{
              id,
              role,
              name,
              createdAt,
              updatedAt,
              password,
              verified
            }
          }
        }
      `,
        })
        .expect(200)
        .expect((resp) => {
          const {
            seeProfile: { ok, error, user },
          } = resp.body.data;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(user).toEqual(expect.any(Object));
          expect(user.id).toEqual(testId);
          expect(user.name).toEqual(expect.any(String));
        });
    });
    it('should fail searching wrong id', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('jwt', jwtToken)
        .send({
          query: ` {
          seeProfile(id: 999){
            ok,
            error,
            user{
              id,
              role,
              name,
              createdAt,
              updatedAt,
              password,
              verified
            }
          }
        }
      `,
        })
        .expect(200)
        .expect((resp) => {
          const {
            seeProfile: { ok, error, user },
          } = resp.body.data;
          expect(ok).toEqual(false);
          expect(error).toEqual(expect.any(String));
          expect(user).toEqual(null);
        });
    });
  });

  describe('me', () => {
    it('should succeed with valid token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('jwt', jwtToken)
        .send({
          query: `{
          me {
            ok,
            error,
            user{
              id,
              name,
              email,
              password
              verified
            }
          }
        }`,
        })
        .expect(200)
        .expect((resp) => {
          const {
            ok,
            error,
            user: { id, name, email },
          } = resp.body.data.me;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(id).toEqual(expect.any(Number));
          expect(name).toEqual(expect.any(String));
          expect(email).toEqual(expect.any(String));
        });
    });
    it('should fail with no token', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{
          me {
            ok,
            error,
            user{
              id,
              name,
              email,
              password
              verified
            }
          }
        }`,
        })
        .expect(200)
        .expect((resp) => {
          const [{ message }] = resp.body.errors;
          expect(message).toEqual('Forbidden resource');
        });
    });
  });
  describe('verifyEmail', () => {
    beforeAll(async () => {
      verification = await verificationRepository.findOne();
    });

    it('succeed with valid verification code', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
              verifyEmail(VerificationInput: {
                code: "${verification.code}"}
              ) {
                ok,
                error,
                user {
                  id,
                  name
                }
              }
            }`,
        })
        .expect(200)
        .expect((resp) => {
          const {
            verifyEmail: {
              ok,
              error,
              user: { id, name },
            },
          } = resp.body.data;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(id).toEqual(expect.any(Number));
          expect(name).toEqual(expect.any(String));
        });
    });

    it('fails with invalid verification code', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `mutation {
              verifyEmail(VerificationInput: {
                code: "${verification.code}"}
              ) {
                ok,
                error,
                user {
                  id,
                  name
                }
              }
            }`,
        })
        .expect(200)
        .expect((resp) => {
          const {
            verifyEmail: { ok, error, user },
          } = resp.body.data;
          expect(ok).toEqual(false);
          expect(error).toEqual(expect.any(String));
          expect(user).toEqual(null);
        });
    });
  });

  describe('editProfile', () => {
    it('should succeed', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('jwt', jwtToken)
        .send({
          query: `mutation {
            editProfile(EditUserInput: {
              email: "revised",
              password: "revised"
            }) {
              ok,
              error,
              user {
                id,
                name,
                email
              }
            }
          }`,
        })
        .expect(200)
        .expect((resp) => {
          const {
            editProfile: {
              ok,
              error,
              user: { id, name, email },
            },
          } = resp.body.data;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(id).toEqual(expect.any(Number));
          expect(name).toEqual(expect.any(String));
          expect(email).toEqual(expect.any(String));
        });
    });
    it('should fail without change', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('jwt', jwtToken)
        .send({
          query: `mutation {
            editProfile(EditUserInput: {
            }) {
              ok,
              error,
              user {
                id,
                name,
                email
              }
            }
          }`,
        })
        .expect(200)
        .expect((resp) => {
          const {
            editProfile: { ok, error, user },
          } = resp.body.data;
          expect(ok).toEqual(false);
          expect(error).toEqual('Found Nothing to update');
          expect(user).toEqual(null);
        });
    });
  });
});
