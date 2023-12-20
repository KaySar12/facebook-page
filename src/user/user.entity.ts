import { FacebookPage } from 'src/facebook/facebookPage.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { v4 as uuid } from 'uuid';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('nvarchar')
  userId: string;
  @Column('nvarchar')
  email: string;
  @Column('nvarchar')
  displayName: string;
  @OneToMany(() => FacebookPage, (facebookPage) => facebookPage.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  facebookPages: FacebookPage[]

  @CreateDateColumn()
  createdDate: Date;
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
