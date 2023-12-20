import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { FacebookPage } from 'src/facebook/facebookPage.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(User) private facebookPageRepository: Repository<FacebookPage>,
  ) { }

  async create(data: any) {
    try {
      const user = new User();
      user.userId = data.userId;
      user.email = data.email;
      user.displayName = data.displayName;

      // Create FacebookPage entities and associate them with the user
      const facebookPages = data.facebookPage.map((pageData) => {
        const newPage = new FacebookPage();
        newPage.category = pageData.category;
        newPage.pageId = pageData.id;
        newPage.name = pageData.name;
        newPage.user = user; // Associate the FacebookPage with the user
        return newPage;
      });

      // Assign the created FacebookPages to the user
      user.facebookPages = facebookPages;

      // Save the user along with the associated FacebookPages
      await this.userRepository.save(user);

      console.log('User and associated FacebookPages saved successfully');
    } catch (error) {
      console.log('Failed to create user');
      console.error(error);
    }
  }
  async checkExist(email: string): Promise<any> {
    const checkExist = await this.userRepository.findOne({ where: { email: email } });
    if (checkExist) {
      return checkExist;
    }
    return undefined;
  }

  async findOwnerById() {
    return await this.userRepository.findOne({ where: { userId: '1425721644676951' } });
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
