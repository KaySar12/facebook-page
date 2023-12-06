import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserService } from './user.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';


@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: 'authenSecret',
          signOptions: {
            expiresIn: 360000,
          },
          global: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    RefreshTokenIdsStorage,
    LocalStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [AuthService, JwtStrategy, PassportModule, UserService, JwtModule],
})
export class AuthModule { }
