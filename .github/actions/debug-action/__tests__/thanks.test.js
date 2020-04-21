"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const nock_1 = __importDefault(require("nock"));
const thanks_1 = __importDefault(require("../../thanks")); //Estaba ../
beforeEach(() => {
    jest.resetModules();
    github.context.payload = {
        action: 'opened',
        issue: {
            number: 1,
        },
    };
});
describe('thanks action', () => {
    it('adds a thanks comment and heart reaction', async () => {
        process.env['INPUT_THANKS-MESSAGE'] = 'Thanks for opening an issue ❤!';
        process.env['GITHUB_REPOSITORY'] = 'example/repository';
        process.env['GITHUB_TOKEN'] = '12345';
        nock_1.default('https://api.github.com')
            .post('/repos/example/repository/issues/1/comments', (body) => body.body === 'Thanks for opening an issue ❤!')
            .reply(200, { url: 'https://github.com/example/repository/issues/1#comment' });
        nock_1.default('https://api.github.com')
            .post('/repos/example/repository/issues/1/reactions', (body) => body.content === 'heart')
            .reply(200, { content: 'heart' });
        await thanks_1.default();
    });
});
