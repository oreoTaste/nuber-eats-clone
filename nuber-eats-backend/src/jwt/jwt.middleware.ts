import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService,
                private readonly userService: UsersService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        if('token' in req.headers) {
            console.log(`>>>>> [JwtMiddleware][use] token: ${req.headers.token}`);
            try {
                let token = this.jwtService.verifyAndReissue(req.headers.token.toString());
                let user = await this.userService.findById(Number(this.jwtService.decodeUser(token)));
                req['user'] = user;
                res.clearCookie('token');
                res.cookie('token', token);
                // } catch(e) {
            } catch(e) {}
        }
        next();
    }
}
