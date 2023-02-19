import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing"
import { Logger } from "src/logger/logger.service";
import { MailService } from "./mail.service";

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
const mockConfigService = () => ({
    get: jest.fn((param) => param),
});
const mockLogger = () => ({
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
})
describe('mailService', () => {
    let mailService: MailService;
    let configService: ConfigService;
    let logger: Logger;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MailService,
                {provide: ConfigService, useValue: mockConfigService()},
                {provide: Logger, useValue: mockLogger()}
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
        it('should fail if MAILGUN_FROM_EMAIL not set', async () => {
            jest.spyOn(configService, 'get').mockReturnValue(null);

            let [emailTo, subject, data] = ['emailTo', 'subject', {text:'data'}];
            mockClient.messages.create.mockReturnValue({
                status: 200,
                id: "id",
                message: "message",
            })
            let rslt = await mailService.send(emailTo, subject, data);
            expect(rslt).toBeFalsy();
            expect(logger.log).toBeCalledTimes(1);
            expect(logger.error).toBeCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(`catch error e:Error: mandatory information omitted: EMAILFROM:[null]`,'send');
        });

        it('should fail if params not input properly', async () => {
            let [emailTo, subject, data] = ['', '', {text:'data'}];
            mockClient.messages.create.mockReturnValue({
                status: 200,
                id: "id",
                message: "message",
            })
            let rslt = await mailService.send(emailTo, subject, data);
            expect(rslt).toBeFalsy();
            expect(logger.log).toBeCalledTimes(1);
            expect(logger.error).toBeCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(`catch error e:Error: mandatory information omitted: to:[], subject:[]`,'send');
        });
        it('should fail if messages not created', async () => {
            let [emailTo, subject, data] = ['emailTo', 'subject', {text:'data'}];
            mockClient.messages.create.mockReturnValue({
                status: 404,
                id: "id",
                message: "message",
            })
            let rslt = await mailService.send(emailTo, subject, data);
            expect(rslt).toBeFalsy();
            expect(logger.log).toBeCalledTimes(3);
            expect(logger.error).toBeCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(`catch error e:Error: message`,'send');
        });
        it('succeed', async () => {
            let [emailTo, subject, data] = ['emailTo', 'subject', {text:'data'}];
            mockClient.messages.create.mockReturnValue({
                status: 200,
                id: "id",
                message: "message",
            })
            let rslt = await mailService.send(emailTo, subject, data);
            expect(rslt).toBeTruthy();
            expect(logger.log).toBeCalledTimes(3);
            expect(logger.error).toBeCalledTimes(0);
        });
    })

    describe('sendText', () => {
        it('should fail if MAILGUN_FROM_EMAIL not set', async () => {
            jest.spyOn(configService, 'get').mockReturnValue(null);

            let [emailTo, subject, data] = ['emailTo', 'subject', 'data'];
            mockClient.messages.create.mockReturnValue({
                status: 200,
                id: "id",
                message: "message",
            })
            let rslt = await mailService.sendText(emailTo, subject, data);
            expect(rslt).toBeFalsy();
            expect(logger.log).toBeCalledTimes(1);
            expect(logger.error).toBeCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(`catch error e:Error: mandatory information omitted: EMAILFROM:[null]`,'send');
        });

        it('should fail if params not input properly', async () => {
            let [emailTo, subject, data] = ['emailTo', 'subject', null];
            mockClient.messages.create.mockReturnValue({
                status: 200,
                id: "id",
                message: "message",
            })
            let rslt = await mailService.sendText(emailTo, subject, data);
            expect(rslt).toBeFalsy();
            expect(logger.log).toBeCalledTimes(1);
            expect(logger.error).toBeCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(`catch error e:Error: mandatory information omitted: text:[null]`,'sendText');
        });

        it('succeed', async () => {
            let [emailTo, subject, data] = ['emailTo', 'subject', 'data'];
            let rslt = await mailService.sendText(emailTo, subject, data);
            expect(rslt).toBeTruthy();
        })
    })

    describe('sendTemplate', () => {
        it('should fail if MAILGUN_FROM_EMAIL not set', async () => {
            jest.spyOn(configService, 'get').mockReturnValue(null);

            let [emailTo, subject, data] = ['emailTo', 'subject', [{code: "code", value: "12345"}, {code: "username", value: "Youngkuk Sohn"}]];
            mockClient.messages.create.mockReturnValue({
                status: 200,
                id: "id",
                message: "message",
            })
            let rslt = await mailService.sendTemplate(emailTo, subject, 'verification', data);
            expect(rslt).toBeFalsy();
            expect(logger.log).toBeCalledTimes(1);
            expect(logger.error).toBeCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(`catch error e:Error: mandatory information omitted: EMAILFROM:[null]`,'send');
        });

        it('should fail if params not input properly', async () => {
            let [emailTo, subject, data] = ['emailTo', 'subject', []];
            mockClient.messages.create.mockReturnValue({
                status: 200,
                id: "id",
                message: "message",
            })
            let rslt = await mailService.sendTemplate(emailTo, subject, 'verification', data);
            expect(rslt).toBeFalsy();
            expect(logger.log).toBeCalledTimes(1);
            expect(logger.error).toBeCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith(`catch error e:Error: mandatory information omitted: variables:[null]`,'sendTemplate');
        });

        it('succeed', async () => {
            let [emailTo, subject, data] = ['emailTo', 'subject', [{code: "code", value: "12345"}, {code: "username", value: "Youngkuk Sohn"}]];
            let rslt = await mailService.sendTemplate(emailTo, subject, 'verification', data);
            expect(rslt).toBeTruthy();
        })
    })

})