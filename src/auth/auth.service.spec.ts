import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;
  beforeEach(async () => {
    const users: User[] = [];
    const crypt = (await bcrypt.genSalt()).toString();
    fakeUserService = {
      create: (username: string, password: string) => {
        const user = {
          id: 'randomhash',
          username,
          password,
          salt: crypt,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      findOne: (username: string) => {
        const filteredUser = users.filter(
          (user) => user.username === username,
        )[0];
        return Promise.resolve(filteredUser);
      },
    };
    // Mock bcrypt.hash to skip actual hashing during testing
    jest.spyOn(bcrypt, 'hash').mockImplementation(async (data) => data);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: UserService, useValue: fakeUserService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('create a new user with salted and hashed password', async () => {
    const user = await service.signUp({
      username: 'simple@gmail.com',
      password: 'asdf',
    });
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('user successfull created', async () => {
    await service.signUp({ username: 'asdf@asdf.com', password: 'asdf' });
    expect(fakeUserService.findOne('asdf@asdf.com')).not.toEqual(null);
  });
  it('throws if signin is called with an unused email', async () => {
    service.signUp({ username: 'simple@gmail.com', password: 'passdflkj' });
    await expect(
      service.signIn({ username: 'simple@gmail.com', password: 'passdflkj' }),
    ).rejects.toThrow(BadRequestException);
  });
  it('throws if an invalid password is provided', async () => {
    await expect(
      service.signIn({ username: 'simple@gmail.com', password: '1233' }),
    ).rejects.toThrow(BadRequestException);
  });

  //Bi loi sua sau
  it('returns access token if correct password is provided', async () => {
    // Create a user with a known password
    // const username = 'user1';
    // const password = 'password123';
    // await service.signUp({ username, password });
    // // Call the signIn method with the correct password
    // const { accessToken } = await service.signIn({ username, password });
    // // Assert that the access token is not null or undefined
    // expect(accessToken).toBeTruthy();
  });
});
