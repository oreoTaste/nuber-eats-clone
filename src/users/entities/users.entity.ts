import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsString } from 'class-validator';
import { NotFoundException } from '@nestjs/common';

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

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  token: string;

  @BeforeInsert()
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
