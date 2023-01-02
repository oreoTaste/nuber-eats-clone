import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserInput, GetUserOutput } from './dtos/get-user.dto';
import { GetUsersInput, GetUsersOutput } from './dtos/get-uses.dto';
import { InsertUserGrpInput, InsertUserGrpOutput } from './dtos/insert-user-grp.dto';
import { InsertUserInput, InsertUserOutput } from './dtos/insert-user.dto';
import { User, UserGrp } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly user: Repository<User>,
                @InjectRepository(UserGrp) private readonly userGrp: Repository<UserGrp>
               ){}

    async insertUserGrp(insertUserGrpInput: InsertUserGrpInput): Promise<InsertUserGrpOutput>{
        try {
            let userGrp = await this.userGrp.save(insertUserGrpInput);
            if(userGrp) {
                return {cnt: 1, reason: 'ok', idUserGrp: userGrp.id};
            } else {
                return {cnt: 0, reason: 'error while inserting userGrp', idUserGrp: null};
            }
        } catch {
            return {cnt: 0, reason: 'error while inserting userGrp', idUserGrp: null};
        }
    }

    async insertUser(insertUserInput: InsertUserInput): Promise<InsertUserOutput>{
        try {
            if(!insertUserInput.idUserGrp) {
                return {cnt: 0, reason: 'no user group found', idUser: null};
            }
            let userGrp = await this.userGrp.findOne({where: {id: insertUserInput.idUserGrp}})
            let user = await this.user.save(
                this.user.create({ ...insertUserInput, userGrp})
            );
            if(user) {
                return {cnt: 1, reason: 'ok', idUser: user.id};
            }
        } catch {
            return {cnt: 0, reason: 'error while inserting user', idUser: null};
        }
    }

    async getUsers(getUsrsInput: GetUsersInput): Promise<GetUsersOutput>{
        let userGrp = await this.userGrp.findOne({where: getUsrsInput});
        if(userGrp) {
            let [userList, cnt] = await this.user.findAndCount({where: {userGrp: {id: userGrp.id}}});
            if(cnt == 0) {
                return {users: userList, cnt, reason:"no user found in the group"};
            }
            return {users: userList, cnt, reason:"ok"};
        } else {
            return {users: null, cnt: 0, reason:"no user group found"};
        }
    }

    async getUser(getUsrInput: GetUserInput): Promise<GetUserOutput>{
        let user = await this.user.findOne({where: getUsrInput});
        if(user) {
            return {cnt:1, reason: "ok", user};
        }
        return {cnt: 0, reason: "no user found for the id", user: null};
    }
}
