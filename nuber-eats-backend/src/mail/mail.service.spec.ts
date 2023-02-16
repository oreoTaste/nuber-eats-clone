import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing"
import { Logger } from "src/logger/logger.service";
import { MailService } from "./mail.service";
import Mailgun from 'mailgun.js';

const mockClient = {
    messages: {
        create: jest.fn()
    }
}
jest.mock('mailgun.js', () => {
    const mockMailgun = {
        Mailgun: jest.fn().mockReturnThis(),
        client: jest.fn().mockImplementation(() => {
            return mockClient
        })
    };
    return {
        default: jest.fn().mockImplementation(() => {
            return mockMailgun
        })
    };
});
const mockConfigService = {
    get: jest.fn((param) => param),
}
const mockLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
}
describe('mailService', () => {
    let mailService: MailService;
    let configService: ConfigService;
    let logger: Logger;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MailService,
                {provide: ConfigService, useValue: mockConfigService},
                {provide: Logger, useValue: mockLogger}
            ]
        }).compile();
        mailService = module.get<MailService>(MailService);
        configService = module.get<ConfigService>(ConfigService);
        logger = module.get<Logger>(Logger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should be defined', () => {
        expect(mailService).toBeDefined();
        expect(configService).toBeDefined();
        expect(logger).toBeDefined();
    })

    describe('send', () => {
        it.todo('should params not input properly');
        it('should fail if messages not created', async () => {
            let [emailTo, subject, data] = ['emailTo', 'subject', {text:'data'}];
            jest.spyOn(mockClient.messages, 'create').mockReturnValue({
                status: "status",
                id: "id",
                message: "message",
            })
            let rslt = await mailService.send(emailTo, subject, data);
            expect(rslt).toBeFalsy();
            expect(logger.log).toBeCalledTimes(3);
            expect(logger.error).toBeCalledTimes(1);
        });
        it.todo('succeed');
    })
})