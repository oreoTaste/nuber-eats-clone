import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('UserModule (e2e)', () => {
  let appModule: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appModule = module.createNestApplication();
    await appModule.init();
  });

  afterAll(async () => {
    appModule.close();
  })
  it.todo('createAccount');
  it.todo('searchGrpUsers');
  it.todo('searchUser');
  it.todo('login');
  it.todo('me');
  it.todo('updateProfile');
  it.todo('expireProfile');
  it.todo('generateEmailCode');
  it.todo('verifyEmail');

});
