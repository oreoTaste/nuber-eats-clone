import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserGrp } from './entities/user.entity';
import { ILike, Repository, MoreThan, FindOptionsWhere } from 'typeorm';
import { SearchUserInput, SearchUserOutput } from './dtos/search-user.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { SearchGrpUsersInput, SearchGrpUsersOutput } from './dtos/search-grp-uses.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { env } from 'process';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly user: Repository<User>,
                @InjectRepository(UserGrp) private readonly userGrp: Repository<UserGrp>,
               ){}

    /** 
     * @description: 그룹내 사용자 조회 (사용자 그룹 검색 -> 사용자 조회)
    */    
    async searchGrpUsers({nmUserGrp, ...etc}: SearchGrpUsersInput): Promise<SearchGrpUsersOutput> {
        try {
            let [userGrp, cnt] = await this.userGrp.findAndCount({relations: ['users'], where: {nmUserGrp: ILike(`%${nmUserGrp}%`), ...etc}});
            if(cnt == 0) {
                return {cnt, reason: `couldn't found user group`};
            } else if(cnt > 1) {
                let users = userGrp.map(el => el.users).flat();
                return {users, cnt: users.length, reason: 'ok'};
            } else {
                return {users: userGrp[0].users, cnt: userGrp[0].users.length, reason: 'ok'};
            }    
        } catch(e){
            console.log(e);
            return {cnt: 0, reason: `error while searching user group`};
        }
    }

    /** 
     * @description: 계정생성 (사용자 그룹 검색/생성 -> 사용자 생성)
    */
    async createAccount({nmUserGrp, tpUserGrp, descUserGrp, nmUser, ddBirth, descUser, password, ...etc}: CreateAccountInput): Promise<CreateAccountOutput> {
        let accountUserGrp: UserGrp;
        try {
            let [userGrp, cnt] = await this.userGrp.findAndCount({where: {nmUserGrp, tpUserGrp, desc: descUserGrp}});
            if(cnt == 0) {
                accountUserGrp = await this.userGrp.save({nmUserGrp, tpUserGrp, descUserGrp, ...etc})
            } else if(cnt == 1){
                accountUserGrp = userGrp[0];
            } else {
                return {cnt:0, reason: 'found multiple user groups while creating account'};
            }
        } catch(e){
            console.log(e);
            return {cnt:0, reason: 'error searching user groups'};
        }

        try {
            let existingUser = await this.user.findOne({where: {nmUser, ddBirth, desc:descUser}});
            if(!existingUser) {
                let account = await this.user.save(this.user.create({nmUser, ddBirth, desc:descUser, ...etc, userGrp:accountUserGrp, password}));
                return {cnt: 1, reason: 'ok', idUser: account.id};
            } else {
                return {cnt: 0, reason: 'found user already', idUser: null};
            }
        } catch(e){
            console.log(e);
            return {cnt: 0, reason: 'error while creating user account', idUser: null};
        }
    }
    
    /** 
     * @description: 사용자 조회 (사용자 검색)
    */
    async searchUser({idUserGrp, idUser, nmUser, ...etc}: SearchUserInput): Promise<SearchUserOutput>{
        try {
            let [user, cntUser] = await this.user.findAndCount({relations: ['userGrp'], where: {id: idUser
                , nmUser: ILike(`%${nmUser? nmUser: ''}%`)
                , userGrp:{id: idUserGrp}
                , ...etc
                 } as FindOptionsWhere<User>});
            if(cntUser > 0) {
                return {cnt:1, reason: "ok", user};
            }
            return {cnt: 0, reason: "no user found for the id", user: null};
        } catch(e){
            console.log(e);
            return {cnt: 0, reason: "error while searching user", user: null};
        }
    }

    /**
     * @description: 로그인
     */
    async login({idLogin, password}: LoginInput): Promise<LoginOutput> {
        try {
            // console.log(env.TOKEN_KEY);
            let user = await this.user.findOne({where: {idLogin}})
            if(!user) {
                return {cnt: 0, reason: "wrong information"};
            }
            let goodPassword = await user.checkPassword(password);
            if(goodPassword) {
                return {cnt: 0, reason: "ok", token: '123'};
            } else {
                return {cnt: 0, reason: "wrong  information"};
            }
        } catch(e) {
            console.log(e)
            return {cnt: 0, reason: "error while login in"};
        }
    }
}
