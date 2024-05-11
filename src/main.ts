import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['any-string-key'],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Stripe out any properties not included in the DTO
      forbidNonWhitelisted: true, // Throw an error if any properties sent in the request are not included in the expected DTO
      // transform: true, // Automatically transform payloads to their corresponding DTO types and instances (ex: string to number, JSON to class instance, etc.) - might impact performance
      // transformOptions: {
      //   enableImplicitConversion: true, // Automatically transform payloads to their corresponding DTO types and instances (ex: string to number, JSON to class instance, etc.) - might impact performance
      // },
    }),
  );
  await app.listen(3000);
}
bootstrap();
