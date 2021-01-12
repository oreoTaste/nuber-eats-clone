import {
  createParamDecorator,
  ExecutionContext,
  NotImplementedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const AuthUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const graphqlContext = GqlExecutionContext.create(context).getContext();
    const user = graphqlContext['user'];
    if (!user) {
      throw new NotImplementedException("Couldn't authorize user");
    }
    return user;
  },
);
