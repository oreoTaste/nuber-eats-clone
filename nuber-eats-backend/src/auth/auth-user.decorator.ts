import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';


export const AuthUser = createParamDecorator((data, ctx: ExecutionContextHost)=> {
    let gql = GqlExecutionContext.create(ctx).getContext();
    if('user' in gql) {
        console.log(`>>>>> [AuthUser] idUser: ${gql['user']['id']}`);
        return gql['user'];
    }
    console.log(`>>>>> [AuthUser] idUser: null`);
    return null;
})

