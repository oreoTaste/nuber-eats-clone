import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEnum, IsString } from 'class-validator';
import { Verification } from './verification.entity';
import { boolean } from 'joi';

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
  @Column({ select: false })
  @IsString()
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  token: string;

  // @Field(() => Verification)
  // @OneToOne(() => Verification, {})
  // verification: Verification;
  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hasPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    const compareResult = await bcrypt.compare(password, this.password);
    if (!compareResult) {
      return false;
    }
    return true;
  }
}
