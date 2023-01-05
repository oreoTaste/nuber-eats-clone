import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddUserInput, AddUserOutput } from './dtos/add-user.dto';
import { User, UserGrp } from './entities/user.entity';
import { AddUserGrpInput, AddUserGrpOutput } from './dtos/add-user-grp.dto';
import { FindGrpUsersInput, FindGrpUsersOutput } from './dtos/find-grp-uses.dto';
import { FindUserInput, FindUserOutput } from './dtos/find-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly user: Repository<User>,
                @InjectRepository(UserGrp) private readonly userGrp: Repository<UserGrp>
               ){}

    async addUserGrp(addUserGrpInput: AddUserGrpInput): Promise<AddUserGrpOutput>{
        try {
            let userGrp = await this.userGrp.save(addUserGrpInput);
            if(userGrp) {
                return {cnt: 1, reason: 'ok', idUserGrp: userGrp.id};
            } else {
                return {cnt: 0, reason: 'error while adding userGrp', idUserGrp: null};
            }
        } catch {
            return {cnt: 0, reason: 'error while adding userGrp', idUserGrp: null};
        }
    }

    async addUser(addUserInput: AddUserInput): Promise<AddUserOutput>{
        try {
            if(!addUserInput.idUserGrp) {
                return {cnt: 0, reason: 'no user group found', idUser: null};
            }
            let userGrp = await this.userGrp.findOne({where: {id: addUserInput.idUserGrp}})
            let user = await this.user.save(
                this.user.create({ ...addUserInput, userGrp})
            );
            if(user) {
                return {cnt: 1, reason: 'ok', idUser: user.id};
            }
        } catch {
            return {cnt: 0, reason: 'error while adding user', idUser: null};
        }
    }

    async findGrpUsers({idUserGrp}: FindGrpUsersInput): Promise<FindGrpUsersOutput>{
        let userGrp = await this.userGrp.findOne({where: {id: idUserGrp}});
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

    async findUser({idUser}: FindUserInput): Promise<FindUserOutput>{
        let user = await this.user.findOne({where: {id: idUser}});
        if(user) {
            return {cnt:1, reason: "ok", user};
        }
        return {cnt: 0, reason: "no user found for the id", user: null};
    }
}
