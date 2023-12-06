import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly configService: ConfigService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await this.hashPassword(password, salt);
    try {
      const user = await this.userService.create(
        username,
        hashedPassword,
        salt,
      );
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          `${authCredentialsDto.username} already in use`,
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    const user = await this.validateUserPassword(authCredentialsDto);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const id = user.id;
    const payload: JwtPayload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    // const token = accessToken;

    // const decodedToken = this.jwtService.decode(token);

    // console.log(decodedToken);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    await this.refreshTokenIdsStorage.insert(id, refreshToken);
    //return response.status(HttpStatus.OK).json(token)
    return  refreshToken ;
  }
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.userService.findOne(username);

    if (user) {
      // Use the user instance's validatePassword method
      const isValidPassword = await this.validatePassword(user, password);
      return isValidPassword ? user : null;
    }
    throw new BadRequestException('User not found'); // Throw an exception if the user is not found
  }
  async validatePassword(user: User, password: string): Promise<boolean> {
    if (password) {
      try {
        const hash = await bcrypt.hash(password, user.salt);
        console.log('Password Hash:', hash);
        return hash === user.password;
      } catch (error) {
        console.error('Error hashing password:', error);
      }
    }
    return false; // Password not provided, return false
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      await this.refreshTokenIdsStorage.validate(decoded.sub, refreshToken);
      const payload = { sub: decoded.sub, username: decoded.username };
      const accessToken = await this.jwtService.signAsync(payload);
      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async invalidateToken(accessToken: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken);
      await this.refreshTokenIdsStorage.invalidate(decoded.sub);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
