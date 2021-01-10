import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import * as jwt from 'jsonwebtoken';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions,
  ) {}
  // eslint-disable-next-line @typescript-eslint/ban-types
  sign(payload: object): string {
    return jwt.sign(payload, this.options.privateKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
