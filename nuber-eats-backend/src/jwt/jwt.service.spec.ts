import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { LoggerModule } from "src/logger/logger.module";
import { JwtService } from "./jwt.service"

const mockConfigService = {
    get: jest.fn(),
};
const mockLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn()
}
describe('JwtService', () => {
    let jwtService: JwtService;
    let configService: ConfigService;
    let logger: Logger;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [LoggerModule],
            providers: [
                JwtService
             , {provide: ConfigService, useValue: mockConfigService}
             , {provide: Logger, useValue: mockLogger}
            ]
        }).compile();
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
        logger = module.get<Logger>(Logger);
    })

    it('should be defined', () => {
        expect(jwtService).toBeDefined();
        expect(configService).toBeDefined();
        expect(logger).toBeDefined();
    })
})