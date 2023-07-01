import { WebClient } from "@slack/web-api";
import pkg from 'slackify-markdown';


export const handler = async (event) => {
  await postMessage(event);
};

const postMessage = async (message) => {
  const web = new WebClient(process.env.SLACK_TOKEN);
  const result = await web.chat.postMessage({
    channel: process.env.SLACK_CHANNEL,
    text: message,
  });
  if (result.ok === false) console.log(result.error);
  else console.log(result.ts);
  return result;
};

const main = async () => {
  const markdown = `
# List of items

* item 1
* item 2
* item 3

[here is an example](https://example.com)
`;
  console.log( pkg(markdown));
  await postMessage(pkg(markdown));
};

main();
