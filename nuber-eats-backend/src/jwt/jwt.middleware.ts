import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService,
                private readonly userService: UsersService,
                private readonly logger: Logger){
                    logger.setContext(JwtMiddleware.name);
                }

    async use(req: Request, res: Response, next: NextFunction) {
        if('token' in req.headers) {
            this.logger.log(`token: ${req.headers.token}`, 'use');
            try {
                let token = this.jwtService.verifyAndReissue(req.headers.token.toString());
                let user = await this.userService.findById(Number(this.jwtService.decodeUser(token)));
                req['user'] = user;
                res.clearCookie('token');
                res.cookie('token', token);
            } catch(e) {}
        }
        next();
    }
}
