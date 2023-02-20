import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from 'src/logger/logger.service';
import { JwtService } from "./jwt.service"
import * as jwt from 'jsonwebtoken';

const testKey = 'testKey';
jest.mock('jsonwebtoken', () => {
    return {
        decode: jest.fn(() => ({id: 'testId'})),
        sign: jest.fn(() => 'testToken'),
        verify: jest.fn(() => 'testToken'),
        TokenExpiredError: class TokenExpiredError extends Error{}
    }
})
const mockConfigService = {
    get: jest.fn(),
};
const mockLogger = {
    setContext: jest.fn(),
    log: jest.fn((...param)=> /*console.log(...param) */{}),
    error: jest.fn()
}
describe('JwtService', () => {
    let jwtService: JwtService;
    let configService: ConfigService;
    let logger: Logger;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            // imports: [LoggerModule],
            providers: [
                JwtService
             , {provide: ConfigService, useValue: mockConfigService}
             , {provide: Logger, useValue: mockLogger}
            ]
        }).compile();
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
        logger = module.get(Logger);
    })

    afterEach(() => {
        jest.clearAllMocks();
    })
    it('should be defined', () => {
        expect(jwtService).toBeDefined();
        expect(configService).toBeDefined();
        expect(logger).toBeDefined();
    })

    it('should decode user', () => {
        let rslt = jwtService.decodeUser(testKey);
        expect(rslt).toMatch('testId');
        expect(jwt.decode).toHaveBeenCalledTimes(1);
        expect(jwt.decode).toHaveBeenLastCalledWith(testKey);
    })

    it('should sign', () => {
        let rslt = jwtService.sign(1);
        expect(rslt).toMatch('testToken');
        expect(logger.log).toHaveBeenCalledTimes(4);
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(jwt.decode).toHaveBeenCalledTimes(1);
    })
    describe('verifyAndReissue', () => {
        it('should fail if jwtService.sign throw error', async () => {
            jest.spyOn(jwtService, "verify").mockImplementation((_)=> {throw Error("test")});
            expect(() => {
                jwtService.verifyAndReissue('token~~');
            }).toThrow('invalid token')
            expect(logger.log).toHaveBeenCalledTimes(2);
        });
        it('should succeed', () => {
            jest.spyOn(jwtService, 'verify').mockReturnValue(null);
            let rslt = jwtService.verifyAndReissue('token~~');
            expect(rslt).toMatch('token~~');
            expect(logger.log).toHaveBeenCalledTimes(2);
        })
    });
    it('should verify', () => {
        let rslt = jwtService.verify('token~~');
        expect(rslt).toMatch('testToken');
        expect(jwt.verify).toHaveBeenCalledTimes(1);

    })
    describe('reissue', () => {
        it('should fail if jwtService.sign throw error', () => {
            jest.spyOn(jwtService, "sign").mockImplementation((_) => {throw new Error()});
            let rslt = jwtService.reissue('token~~');
            expect(jwt.decode('')).toMatchObject({id: 'testId'});
            expect(logger.log).toHaveBeenCalledTimes(3);
            expect(rslt).toMatchObject({'ok': false, 'newToken': null});
        })
        it('should succeed', () => {
            jest.spyOn(jwtService, "sign").mockImplementation((_) => 'newToken');
            let rslt = jwtService.reissue('token~~');
            expect(jwt.decode('')).toMatchObject({id: 'testId'});
            expect(logger.log).toHaveBeenCalledTimes(3);
            expect(rslt).toMatchObject({'ok': true, 'newToken':'newToken'});
        })
    })
})
