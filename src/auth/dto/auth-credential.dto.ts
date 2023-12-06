import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    example: 'user1',
    description: 'The name of the user',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  @ApiProperty({
    example: 'User12345',
    description: 'The user password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
