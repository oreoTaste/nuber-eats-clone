import { ApolloDriver } from '@nestjs/apollo';
import { ApolloDriverConfig } from '@nestjs/apollo/dist/interfaces';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OCR } from './util/OCR';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { MySnakeNamingStrategy } from './util/my-snake-naming-strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import * as Joi from 'joi';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { NestModule } from '@nestjs/common/interfaces/modules';
import { RequestMethod } from '@nestjs/common/enums';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "dev" ? '.dev.env' : (process.env.NODE_ENV === "test" ? '.test.env' : '.env'),
      ignoreEnvFile: process.env.NODE_ENV === "prod",
      validationSchema: Joi.object({
        NODE_ENV:Joi.string().valid('dev','prod','test').required(),
        TOKEN_KEY: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "prod"),
      entities: ['dist/**/*.entity{.ts,.js}'],
      subscribers: [],
      migrations: [],
      namingStrategy: new MySnakeNamingStrategy(),
  }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // autoSchemaFile: true,
      playground: true,
      context: ({req})=>{return {user: req.user}}
    }),
    HealthModule,
    UsersModule,
    JwtModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    LoggerModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService, OCR],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }  
}
