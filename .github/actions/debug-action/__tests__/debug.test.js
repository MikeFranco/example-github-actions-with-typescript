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
const core = __importStar(require("@actions/core"));
const debug_1 = __importDefault(require("../debug"));
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
beforeEach(() => {
    jest.resetModules();
    const doc = js_yaml_1.default.safeLoad(fs_1.default.readFileSync(__dirname + '/../action.yml', 'utf8'));
    Object.keys(doc.inputs).forEach((name) => {
        const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
        process.env[envVar] = doc.inputs[name]['default'];
    });
});
afterEach(() => {
    const doc = js_yaml_1.default.safeLoad(fs_1.default.readFileSync(__dirname + '/../action.yml', 'utf8'));
    Object.keys(doc.inputs).forEach((name) => {
        const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
        delete process.env[envVar];
    });
});
describe('debug action debug messages', () => {
    it('outputs a debug message', async () => {
        const debugMock = jest.spyOn(core, 'debug');
        await debug_1.default();
        expect(debugMock).toHaveBeenCalledWith('👋 Hello! You are an amazing person! 🙌');
    });
});
describe('debug action output', () => {
    it('sets the action output', async () => {
        const setOutputMock = jest.spyOn(core, 'setOutput');
        await debug_1.default();
        expect(setOutputMock).toHaveBeenCalledWith('amazing-message', '👋 Hello! You are an amazing person! 🙌');
    });
});
it('does not output debug messages for non-amazing creatures', async () => {
    process.env['INPUT_AMAZING-CREATURE'] = 'mosquito';
    const debugMock = jest.spyOn(core, 'debug');
    const setFailedMock = jest.spyOn(core, 'setFailed');
    await debug_1.default();
    expect(debugMock).toHaveBeenCalledTimes(0);
    expect(setFailedMock).toHaveBeenCalledWith('Sorry, mosquitos are not amazing 🚫🦟');
});
