import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastModule } from './podcast/podcast.module';
import * as Joi from 'joi';
import { Episode } from './podcast/entities/episode.entity';
import { Podcast } from './podcast/entities/podcast.entity';
import { UsersModule } from './users/users.module';
import { Users } from './users/entities/users.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('prod', 'dev', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAINGUN_APIKEY: Joi.string().required(),
        MAILGUN_DOMAIN: Joi.string().required(),
        MAILGUN_FROM: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV === 'dev',
      entities: [Episode, Podcast, Users, Verification],
      dropSchema:
        process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test',
    }),
    PodcastModule,
    UsersModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    AuthModule,
    MailModule.forRoot({
      apiKey: process.env.MAINGUN_APIKEY,
      domain: process.env.MAILGUN_DOMAIN,
      from: process.env.MAILGUN_FROM,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ method: RequestMethod.POST, path: '*' });
  }
}
