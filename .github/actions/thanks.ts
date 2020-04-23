import * as core from '@actions/core';
import * as github from '@actions/github';

const run = async (): Promise<void> => {
  try {
    //Este action se limita a solo cuando un issue es creado
    if (github.context.payload.action !== 'opened') return;

    //check the payload
    const issue = github.context.payload.issue;
    if (!issue) return;

    const token = process.env['THANKS_USER_TOKEN'] || process.env['GITHUB_TOKEN'];
    if (!token) return;

    //Create octokit client
    const octokit: github.GitHub = new github.GitHub(token);
    const nwo = process.env['GITHUB_REPOSITORY'] || '/';
    const [owner, repo] = nwo.split('/');

    //Reply with thanks message
    //https://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
    const senderName = github.context.payload.sender ? github.context.payload.sender.login : '';
    //const thanksMessage = core.getInput('thanks-message');
    const thanksMessage = `Thanks${senderName ? ` @${senderName}` : ''} for opening an issue ❤️!`;
    const issueCommentResponse = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issue.number,
      body: thanksMessage,
    });
    console.log(`Replied with thanks message: ${issueCommentResponse.data.url}`);
    // Add a reaction
    // https://octokit.github.io/rest.js/#octokit-routes-reactions-create-for-issue
    const issueReactionResponse = await octokit.reactions.createForIssue({
      owner,
      repo,
      issue_number: issue.number,
      content: 'rocket',
    });
    console.log(`Reacted: ${issueReactionResponse.data.content}`);
  } catch (error) {
    console.log(error.message);
    core.setFailed(`Thanks-action failure: ${error}`);
  }
};

run();

export default run;
