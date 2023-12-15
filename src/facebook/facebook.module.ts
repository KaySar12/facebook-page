import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';
import { SessionSerializer } from './facebook-session.serializer';

@Module({
    imports: [HttpModule, ConfigModule, PassportModule.register({ session: true })],
    providers: [FacebookService, FacebookStrategy, SessionSerializer],
    controllers: [FacebookController],
})
export class FacebookModule { }
