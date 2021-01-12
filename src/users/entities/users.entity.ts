import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEnum, IsString } from 'class-validator';

enum UserRole {
  'host',
  'listener',
}
registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
@Entity()
@InputType({ isAbstract: true })
export class Users extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  name: string;

  @Field(() => String)
  @Column()
  @IsString()
  email: string;

  @Field(() => String)
  @Column()
  @IsString()
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  token: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hasPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(password: string): Promise<boolean> {
    const compareResult = await bcrypt.compare(password, this.password);
    if (!compareResult) {
      return false;
    }
    return true;
  }
}
