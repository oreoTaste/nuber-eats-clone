import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification, User, UserGrp } from './entities/user.entity';
import { ILike, Repository, MoreThan, FindOptionsWhere } from 'typeorm';
import { SearchUserInput, SearchUserOutput } from './dtos/search-user.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { SearchGrpUsersInput, SearchGrpUsersOutput } from './dtos/search-grp-uses.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { UpdateProfileInput, UpdateProfileOutput } from './dtos/update-profile.dto';
import { CommonOutput } from 'src/common/dtos/core.dto';
import { ExpireProfileInput } from './dtos/expire-profile.dto';
import { Logger } from 'src/logger/logger.service';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { GenerateEmailCodeOutput } from './dtos/generate-email-code.dto';

@Injectable()
export class UsersService {
    // private readonly logger = new Logger(UsersService.name, {logLevels:['debug']});
    constructor(@InjectRepository(User) private readonly user: Repository<User>,
                @InjectRepository(UserGrp) private readonly userGrp: Repository<UserGrp>,
                @InjectRepository(EmailVerification) private readonly emailVerification: Repository<EmailVerification>,
                /*@Inject(forwardRef(() => ConfigService)) */ private readonly configService: ConfigService,
                private readonly jwtService: JwtService,
                private readonly logger: Logger,
                ){
                    logger.setContext(UsersService.name);
               }

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
            this.logger.error(`catch Error(e): ${e}`, 'searchGrpUsers');
            return {cnt: 0, reason: `error while searching user group`};
        }
    }

    /** 
     * @description: 계정생성 (사용자 그룹 검색/생성 -> 사용자 생성)
    */
    async createAccount({nmUserGrp, tpUserGrp, descUserGrp, nmUser, ddBirth, descUser, password, ddExpire, ...etc}: CreateAccountInput): Promise<CreateAccountOutput> {
        let accountUserGrp: UserGrp;
        try {
            let [userGrp, cnt] = await this.userGrp.findAndCount({where: {nmUserGrp, tpUserGrp, desc: descUserGrp}});
            if(cnt == 0) {
                accountUserGrp = await this.userGrp.save({nmUserGrp, tpUserGrp, descUserGrp, ...etc, idUpdate: (etc.idUpdate? etc.idUpdate: etc.idInsert)})
            } else if(cnt == 1){
                accountUserGrp = userGrp[0];
            } else {
                return {cnt:0, reason: 'found multiple user groups while creating account'};
            }
        } catch(e){
            this.logger.error(`catch Error(e): ${e}`, 'createAccount');
            return {cnt:0, reason: 'error searching user groups'};
        }

        try {
            let existingUser = await this.user.findOne({where: {nmUser, ddBirth, desc:descUser}});
            if(!existingUser) {
                let monthLater = new Date(new Date().setMonth(new Date().getMonth()+1))
                                .toLocaleDateString('ko', {dateStyle: 'medium'})
                                .replace(/\./g,'')
                                .split(' ')
                                .reduce((acc,val) => acc + (Number(val) < 10 ? '0'+val: val));
                let account = await this.user.save(
                                        this.user.create({ddExpire:`${ddExpire? ddExpire: monthLater}`
                                                        , nmUser
                                                        , ddBirth
                                                        , desc:descUser
                                                        , ...etc
                                                        , userGrp:accountUserGrp
                                                        , password}));
                let verification = this.emailVerification.create({user: account, ...etc, idUpdate: (etc.idUpdate? etc.idUpdate: etc.idInsert)});
                let rslt = await this.emailVerification.save(verification);
                return {cnt: 1, reason: 'ok', idUser: account.id};
            } else {
                return {cnt: 0, reason: 'found user already', idUser: null};
            }
        } catch(e){
            this.logger.error(`catch Error(e): ${e}`, 'createAccount');
            return {cnt: 0, reason: 'error while creating user account', idUser: null};
        }
    }

    /**
     * @description: 이메일 코드 검증
     */
    async generateEmailCode(authUser: User): Promise<GenerateEmailCodeOutput> {
        try {
            this.logger.warn(authUser);
            let verification = await this.emailVerification.save(this.emailVerification.create({user: authUser, idUpdate: authUser.id, idInsert: authUser.id}));
            this.logger.warn(verification);
            return {cnt: 1, reason: 'ok'};
        } catch(e) {
            this.logger.warn(`catch Error(e): ${e}`, 'generateEmailCode');
            return {cnt: 0, reason: 'error while generating email verification code'};
        }
    }

    /**
     * @description: 이메일 코드 검증
     */
    async verifyEmail(authUser: User, {code}: VerifyEmailInput): Promise<VerifyEmailOutput> {
        try {
            if(!authUser) {
                return {cnt: 0, reason: 'invalid user'};
            }
            
            if(authUser.dtEmailVerified) {
                return {cnt: 0, reason: 'already verified'};
            }
            let verification = await this.emailVerification.findOne({order: {dtInsert: 'DESC'}, where: {...authUser.emailVerification}})
            if(verification.code !== code) {
                return {cnt: 0, reason: 'wrong code input'};
            }
            authUser.dtEmailVerified = new Date();
            await this.user.save(authUser);
            return {cnt: 1, reason: 'ok'}    
        } catch(e) {
            this.logger.error(`catch Error(e): ${e}`, 'verifyEmail');
            return {cnt: 0, reason: `error while verifying email`};
        }
    }

    /** 
     * @description: 사용자 조회 (사용자 검색)
    */
    async searchUser({idUserGrp, idUser, nmUser, ...etc}: SearchUserInput): Promise<SearchUserOutput>{
        try {
            // token = this.jwtService.verifyAndReissue(token);
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
            this.logger.error(`catch Error(e): ${e}`, 'searchUser');
            return {cnt: 0, reason: "error while searching user", user: null};
        }
    }

    /**
     * @description: 로그인
     */
    async login({email, password}: LoginInput): Promise<LoginOutput> {
        try {
            let user = await this.user.findOne({where: {email}})
            if(!user) {
                return {cnt: 0, reason: "wrong information1"};
            }
            let now = new Date().toLocaleDateString('ko', {dateStyle: 'medium'})
                                    .replace(/\./g,'')
                                    .split(' ')
                                    .reduce((acc,val) => acc + (Number(val) < 10 ? '0'+val: val));
            if(user.ddExpire <= now) {
                return {cnt: 0, reason: 'the account is expired'};
            }
            let goodPassword = await user.checkPassword(password);
            if(goodPassword) {
                return {cnt: 0, reason: "ok", token: this.jwtService.sign(user.id)};
            } else {
                return {cnt: 0, reason: "wrong  information2"};
            }
        } catch(e) {
            this.logger.error(`email: ${email}, password: ${password}, catch Error(e): ${e}`, 'login');
            return {cnt: 0, reason: "error while login in"};
        }
    }

    /**
     *  @description: 아이디를 통한 사용자 확인
     */
    async findById(id: number): Promise<User> {
        return this.user.findOne({where: {id} });
    }

    /**
     * @description: 자기 프로필 수정
     */
    async updateProfile(authUser: User, input: UpdateProfileInput): Promise<UpdateProfileOutput> {
        try {
            if(!authUser) {
                return {cnt: 0, reason: 'invalid user'};
            }
            let rslt = await this.user.save(Object.assign(authUser, input));
            if(rslt) {
                return {cnt: 1, reason: 'ok'};
            }
            throw Error();
        } catch(e) {
            return {cnt: 0, reason: 'error while updating profile'};
        }
    }

    /**
     * @description: 계정 미사용처리
     */
    async expireProfile(authUser: User, {email}: ExpireProfileInput): Promise<CommonOutput> {
        try {
            if(!authUser) {
                return {cnt: 0, reason: 'invalid user'};
            }

            if(authUser.email !== email) {
                return {cnt: 0, reason: `cannot expire other user`};
            }
            let now = new Date().toLocaleDateString('ko', {dateStyle: 'medium'})
                                     .replace(/\./g,'')
                                     .split(' ')
                                     .reduce((acc,val) => acc + (Number(val) < 10 ? '0'+val: val));
            if(authUser.ddExpire <= now) {
                return {cnt: 0, reason: `already expired`};
            }

            authUser['ddExpire'] = now;
            let rslt = await this.user.save(authUser);
            if(rslt) {
                return {cnt: 1, reason: 'ok'};
            }
            return {cnt: 0, reason: `couldn't expire the user`};
        } catch(e) {
            this.logger.error(`idUser: ${authUser.id}, catch Error(e): ${e}, `, 'expireProfile')
            return {cnt: 0, reason: `error while expiring the user: ${authUser.id}`};
        }
    }
}
