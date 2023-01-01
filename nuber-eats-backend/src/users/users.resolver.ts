import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUsrInfosInput, GetUsrInfosOutput, UserArgs, UserGrpArgs, UserOutput } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly service: UsersService) {}

    @Mutation(type => Boolean)
    insertUserGrp(@Args() userGrp: UserGrpArgs): boolean {
        return this.service.insertUserGrp(userGrp);
    }

    @Mutation(type => Boolean)
    insertUser(@Args() user: UserArgs): boolean {
        return this.service.insertUsr(user);
    }

    @Query(type => GetUsrInfosOutput)
    async findGrpUsers(@Args('input') idUserGrp: GetUsrInfosInput): Promise<GetUsrInfosOutput> {
        let rslt= await this.service.getUsrInfos(idUserGrp);
        return rslt;
    }

    @Query(type => UserOutput, {nullable: true})
    findUser(@Args('idUser') idUser: number): Promise<UserOutput> {
        return this.service.getUsrInfo(idUser);
    }
}
