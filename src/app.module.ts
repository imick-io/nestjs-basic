import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Stripe out any properties not included in the DTO
        forbidNonWhitelisted: true, // Throw an error if any properties sent in the request are not included in the expected DTO
        // transform: true, // Automatically transform payloads to their corresponding DTO types and instances (ex: string to number, JSON to class instance, etc.) - might impact performance
        // transformOptions: {
        //   enableImplicitConversion: true, // Automatically transform payloads to their corresponding DTO types and instances (ex: string to number, JSON to class instance, etc.) - might impact performance
        // },
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['any-string-key'],
        }),
      )
      .forRoutes('*');
  }
}
