import { WebClient } from '@slack/web-api';

export const handler = async (event) => {
    await postMessage(event);
}

const postMessage = async (message) => {
    const web = new WebClient(process.env.SLACK_TOKEN);
    const result = await web.chat.postMessage({
        channel: process.env.SLACK_CHANNEL,
        text: message,
    });
    if(result.ok === false)
        console.log(result.error);
    else
        console.log(result.ts);
    return result;
}