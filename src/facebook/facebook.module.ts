import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[HttpModule,ConfigModule],
    providers:[FacebookService],
    controllers:[FacebookController],
})
export class FacebookModule{}
