import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    example: 'user1',
    description: 'The name of the user',
  })
  @Column()
  username: string;
  @ApiProperty({
    example: 'User12345',
    description: 'The user password',
  })
  @Column()
  password: string;
  @Column()
  salt: string;
  @BeforeInsert()
  generateUUID() {
    this.id = uuid();
  }
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
