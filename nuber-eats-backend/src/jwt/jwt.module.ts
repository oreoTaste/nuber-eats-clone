import { Module, DynamicModule } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { Logger } from 'src/logger/logger.service';
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
            imports: [LoggerModule],
            exports: [JwtService],
            providers: [JwtService]
        }
    }
}
