import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Logger } from 'src/logger/logger.service';


export const AuthUser = createParamDecorator((data, ctx: ExecutionContextHost)=> {
    const logger = new Logger();
    logger.setContext('AuthUser Decorator');
    let gql = GqlExecutionContext.create(ctx).getContext();
    if('user' in gql) {
        logger.debug(`idUser: ${gql['user']['id']}`);
        return gql['user'];
    }
    logger.debug(`idUser: null`);
    return null;
})

