import { Module, DynamicModule } from '@nestjs/common';
import { JwtService } from './jwt.service';

type Option = {
    isGlobal: boolean,
}
@Module({
//   providers: [JwtService]
})
export class JwtModule {
    static forRoot(option: Option): DynamicModule{
        return {
            global: option.isGlobal,
            module: JwtModule,
            exports: [JwtService],
            providers: [JwtService]
        }
    }
}
