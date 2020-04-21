"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const run = async () => {
    try {
        //Este action se limita a solo cuando un issue es creado
        if (github.context.payload.action !== 'opened')
            return;
        //check the payload
        const issue = github.context.payload.issue;
        if (!issue)
            return;
        const token = process.env['GITHUB_TOKEN'];
        if (!token)
            return;
        //Create octokit client
        const octokit = new github.GitHub(token);
        const nwo = process.env['GITHUB_REPOSITORY'] || '/';
        const [owner, repo] = nwo.split('/');
        //Reply with thanks message
        //https://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
        const thanksMessage = core.getInput('thanks-message');
        const issueCommentResponse = await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issue.number,
            body: thanksMessage,
        });
        console.log(`Replied with thabks message: ${issueCommentResponse.data.url}`);
        // Add a reaction
        // https://octokit.github.io/rest.js/#octokit-routes-reactions-create-for-issue
        const issueReactionResponse = await octokit.reactions.createForIssue({
            owner,
            repo,
            issue_number: issue.number,
            content: 'heart',
        });
        console.log(`Reacted: ${issueReactionResponse.data.content}`);
    }
    catch (error) {
        console.error(error.message);
        core.setFailed(`Thanks-action failure: ${error}`);
    }
};
run();
exports.default = run;
