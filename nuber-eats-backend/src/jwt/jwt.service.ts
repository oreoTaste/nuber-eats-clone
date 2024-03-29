import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Logger } from 'src/logger/logger.service';

@Injectable()
export class JwtService {
    constructor(private readonly configService: ConfigService,
                private readonly logger: Logger){
        this.logger.setContext(JwtService.name);
        this.logger.log("JwtService", "constructor");
    }

    /**
     * @description: 토큰으로부터 사용자ID분리
     */
    decodeUser(token: string): string {
        return jwt.decode(token)['id'];
    }

    /**
     * @description: 로그인 검증시 토큰값 생성
     * @returns: token
     */
    sign(id: number) {
        this.logger.log(`user-id: ${id}`, 'sign');
        let token = jwt.sign({id}, this.configService.get("TOKEN_KEY"), {algorithm: "HS512", expiresIn:"3m"})
        this.logger.log(`new token:` + ` ${token}`, 'sign');
        let decoded = jwt.decode(token);
        this.logger.log(`open new token:`
                  + ` id: ${decoded['id']}`
                  + `, iat: ${new Date(decoded['iat']*1000).toLocaleDateString().replace(/ /g,'')} ${new Date(decoded['iat']*1000).toLocaleTimeString()}`
                  + `, exp: ${new Date(decoded['exp']*1000).toLocaleDateString().replace(/ /g,'')} ${new Date(decoded['exp']*1000).toLocaleTimeString()}`
                  , 'sign');
        return token;
    }

    /**
     * @description: 유효성 확인 및 만료된 경우 재발급
     * @returns: when no error occurs, newToken will be returned (else error will be thrown)
     */
    verifyAndReissue(token: string): string {
        this.logger.log(`now: ${new Date().toLocaleDateString().replace(/ /g, '')} ${new Date().toLocaleTimeString()}`, 'verifyAndReissue');
        try {
            this.verify(token);
        } catch(e) {
            if(e instanceof jwt.TokenExpiredError) {
                let {ok, newToken} = this.reissue(token);
                if(!ok) {
                    token = null;
                    throw Error("error while reissuing a token");
                }
                token = newToken;
            } else {
                throw Error("invalid token");
            }
        }
        return token;
    }

    verify(token: string) {
        return jwt.verify(token, this.configService.get("TOKEN_KEY"), {algorithms: ["HS512"]})
    }

    reissue(token: string): {'ok': boolean, 'newToken': string|null} {
        this.logger.log(`old token: ${token}`, 'reissue');
        try {
            let oldToken = jwt.decode(token);
            this.logger.log(`open old token:`
                      + ` id: ${oldToken['id']}`
                      + `, iat: ${new Date(oldToken['iat']*1000).toLocaleDateString().replace(/ /g,'')} ${new Date(oldToken['iat']*1000).toLocaleTimeString()}`
                      + `, exp: ${new Date(oldToken['exp']*1000).toLocaleDateString().replace(/ /g,'')} ${new Date(oldToken['exp']*1000).toLocaleTimeString()}`
                      , 'reissue');
            let newToken = this.sign(oldToken['id']);
            this.logger.error(`new token(e): ${newToken}`, 'reissue');
            return {'ok': true, newToken};
        } catch(e) {
            this.logger.error(`catch error(e): ${e}`, 'reissue');
            return {'ok': false, 'newToken': null}
        }
    }

}
