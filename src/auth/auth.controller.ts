import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  ValidationPipe,
  Get,
  UseGuards,
  Request,
  Headers,
  Res,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from './decorator/get-user.decorator';
import { Public } from './decorator/public.decorator';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @ApiOperation({ description: 'Signup  new User' })
  @ApiCreatedResponse({
    description: 'a user has been successfully created',
    type: User,
  })
  @Post('/signup')
  async signup(@Res() response,
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    const newUser = await this.authService.signUp(authCredentialsDto);
    return response.status(HttpStatus.CREATED).json({
      newUser
    })
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Login user' })
  @ApiOkResponse({
    description: 'The users logged in successfully.',
    type: User,
  })
  @Public()
  //@UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signin(@Res() response,
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const signIn=await this.authService.signIn(authCredentialsDto)
    console.log(signIn);
    return response.status(HttpStatus.OK).json(signIn);
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'current login user' })
  @ApiOkResponse({
    description: 'The users is currently logged in ',
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/current-user')
  currentUser(@GetUser() user: User) {
    return user;
  }
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshAccessToken(
      refreshTokenDto.refresh_token,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('invalidate-token')
  async invalidateToken(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    await this.authService.invalidateToken(token);
    return { message: 'Token invalidated successfully' };
  }
  @Get('/signout')
  async signout(@Request() req) {
    req.session.destroy();
    await this.authService.invalidateToken(req.headers.authorization);
    return { msg: 'The user session has ended' };
  }
}
