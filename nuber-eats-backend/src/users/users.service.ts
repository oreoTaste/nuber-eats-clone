import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserArgs, UserGrpArgs } from './dtos/user.dto';
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

    getUsrInfos(idUserGrp: number): Promise<User[]>{
        return this.user.find({where: { userGrp: { id: idUserGrp } }});
    }

    getUsrInfo(idUser: number): Promise<User>{
        return this.user.findOne({where: { id: idUser }});
    }
}
