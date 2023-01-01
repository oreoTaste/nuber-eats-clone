import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUsrInfosInput, GetUsrInfosOutput, UserArgs, UserGrpArgs } from './dtos/user.dto';
import { User, UserGrp } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly user: Repository<User>,
                @InjectRepository(UserGrp) private readonly userGrp: Repository<UserGrp>
               ){}

    insertUserGrp(@Args() userGrp: UserGrpArgs): boolean{
        try {
            this.userGrp.insert(userGrp);
            return true;
        } catch {
            return false;
        }
    }

    insertUsr(@Args() user: UserArgs): boolean{
        try {
            this.user.insert(user);
            return true;
        } catch {
            return false;
        }
    }

    async getUsrInfos(getUsrInfosInput: GetUsrInfosInput): Promise<GetUsrInfosOutput>{
        let userGrp = await this.userGrp.findOne({where: getUsrInfosInput});
        if(userGrp) {
            let [userList, cnt] = await this.user.findAndCount({where: {userGrp: {id: userGrp.id}}});
            if(cnt == 0) {
                console.log('3', {users: userList, cnt, reason:"no user found in the group"});
                return {users: userList, cnt, reason:"no user found in the group"};
            }
            return {users: userList, cnt, reason:"ok"};
        } else {
            return {users: null, cnt: 0, reason:"no user group found"};
        }
    }

    async getUsrInfo(idUser: number): Promise<User>{
        return this.user.findOne({where: { id: idUser }});
    }
}
