import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(jsonData: any) {
    const user = this.userRepository.create(jsonData);
    return await this.userRepository.save(user);
  }
  async checkExist(email: string): Promise<boolean> {
    const checkExist = await this.userRepository.findOne({ where: { email: email } });
    if (checkExist) {
      return true;
    }
    return false;
  }
  // findOne(username: string) {
  //   if (!username) {
  //     return null;
  //   }
  //   return this.userRepository.findOneBy({ username });
  // }
  // findOneById(id: string) {
  //   return this.userRepository.findOneBy({ id: id });
  // }
  // async update(username: string, user: Partial<User>) {
  //   const result = await this.findOne(username);
  //   if (!user) {
  //     throw new NotFoundException(`User ${username} does not exist`);
  //   }
  //   Object.assign(result, user);
  // }

  // async remove(username: string) {
  //   const user = await this.findOne(username);
  //   if (!user) {
  //     throw new NotFoundException('user not found');
  //   }
  //   return this.userRepository.remove(user);
  // }
}
