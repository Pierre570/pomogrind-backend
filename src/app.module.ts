import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { TypeOrmModule } from '@nestjs/typeorm';

const environment = process.env.NODE_ENV;
console.log('environment: ', environment);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !environment ? `.env` : `.env.${environment}`,
      load: [databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = environment === 'production';
        if (isProduction) {
          return {
            type: 'postgres',
            host: 'db',
            port: 5432,
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_DB'),
            entities: [],
            synchronize: false,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        } else {
          return {
            type: 'sqlite',
            database: configService.get<string>('DATABASE_NAME'),
            entities: [],
            synchronize: true,
          };
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
