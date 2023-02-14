import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing"
import { Logger } from "src/logger/logger.service";
import { MailService } from "./mail.service";
import Mailgun from 'mailgun.js';

const client = {
    messages: () => {}
    // .create(DOMAIN, data)
}
jest.mock('mailgun.js', () => {
    return {
        client: jest.fn(() => {
            return client;
        }),
    }
});
const mockConfigService = {
    get: jest.fn(),
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

    it('should be defined', () => {
        expect(mailService).toBeDefined();
        expect(configService).toBeDefined();
        expect(logger).toBeDefined();
    })

    describe('send', () => {
        it('should fail if messages not created', async () => {
            let [emailTo, subject, data] = ['emailTo', 'subject', {text:'data'}];
            let rslt = await mailService.send(emailTo, subject, data);
            expect(rslt).toBeFalsy();
        })
    })
})