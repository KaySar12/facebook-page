import { User } from 'src/user/user.entity';
import {
    AfterInsert,
    AfterRemove,
    AfterUpdate,
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { v4 as uuid } from 'uuid';

@Entity()
export class FacebookPage extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('nvarchar')
    pageId: string;
    @Column('nvarchar')
    name: string
    @Column('nvarchar')
    category: string
    @CreateDateColumn()
    createdDate: Date;
    @ManyToOne(() => User, (user: User) => user.facebookPages, { cascade: true })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id',
    }) 
    user: User;
    @BeforeInsert()
    generateUUID() {
        this.id = uuid();
    }
    @AfterInsert()
    logInsert() {
        console.log('Inserted FBPage with id', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated FBPage with id', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed FBPage with id', this.id);
    }
}
