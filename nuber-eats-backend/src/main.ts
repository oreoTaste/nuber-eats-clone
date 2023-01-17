import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


// AppDataSource.initialize()
//              .then(() => {
//               // here you can start to work with your database
//              })
//              .catch((error) => console.log(error));
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'log', 'error', 'warn', 'verbose']
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
