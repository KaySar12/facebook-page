import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { FacebookModule } from './facebook/facebook.module';
import { HttpModule } from '@nestjs/axios';
import { AdminModule } from './admin/admin.module';
import { FacebookService } from './facebook/facebook.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './auth/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
@Global()
@Module({
  imports: [PassportModule.register({ session: true }),
    HttpModule,
    FacebookModule,
  TypeOrmModule.forRoot(typeOrmConfig),
  ConfigModule.forRoot({
    isGlobal: true
  }), AdminModule, UserModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService, FacebookService, CloudinaryService],
  exports: [FacebookService],
})
export class AppModule { }
