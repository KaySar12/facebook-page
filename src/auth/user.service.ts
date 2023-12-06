import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(username: string, password: string, salt: string) {
    const user = this.userRepository.create({ username, password, salt });
    return this.userRepository.save(user);
  }

  findOne(username: string) {
    if (!username) {
      return null;
    }
    return this.userRepository.findOneBy({ username });
  }
  findOneById(id: string) {
    return this.userRepository.findOneBy({ id: id });
  }
  async update(username: string, user: Partial<User>) {
    const result = await this.findOne(username);
    if (!user) {
      throw new NotFoundException(`User ${username} does not exist`);
    }
    Object.assign(result, user);
  }

  async remove(username: string) {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepository.remove(user);
  }
}
