import axios from "axios";
import { sleep } from "../utils/utils.js";
import fs from "fs";

const getMessagesAmount = async (token, channelid) => {
  let { data } = await axios.get(
    `https://discord.com/api/v9/channels/${channelid}/messages/search?min_id=88392440217600000`,
    { headers: { authorization: token, "content-type": "application/json" } }
  );
  if (data?.code === 110000) {
    console.log(`Channel not indexed, retrying in 5 seconds... (${channelid})`);
    await sleep(5000);
    ({ data } = await axios.get(
      `https://discord.com/api/v9/channels/${channelid}/messages/search?min_id=88392440217600000`,
      { headers: { authorization: token, "content-type": "application/json" } }
    ));
    if (data?.code === 110000) {
      console.log(`Failed to get channel messages (${channelid})`);
      return -1;
    }
    return data.total_results;
  }
  return data.total_results;
};

const getChannelMessages = async (token, channelid) => {
  const totalMessages = await getMessagesAmount(token, channelid);
  console.log(`${totalMessages} messages found (${channelid})`);
  let fetchedMessages = [];
  let { data } = await axios.get(
    `https://discord.com/api/v9/channels/${channelid}/messages?limit=100`,
    { headers: { authorization: token, "content-type": "application/json" } }
  );
  fetchedMessages.push(...data);

  let progress = 0;
  let lastMessage = data.slice(-1)[0].id;
  for (let i = 0; i < Math.ceil(totalMessages / 100) - 1; i++) {
    ({ data } = await axios.get(
      `https://discord.com/api/v9/channels/${channelid}/messages?before=${lastMessage}&limit=100`,
      { headers: { authorization: token, "content-type": "application/json" } }
    ));
    fetchedMessages.push(...data);
    lastMessage = data.slice(-1)[0].id;
    progress += 100;
    console.log(`Exported ${progress} of ${totalMessages} (${channelid})`);
    await sleep(200);
  }

  //Removes duplicates caused by last fetch
  const ids = fetchedMessages.map((o) => o.id);
  fetchedMessages = fetchedMessages.filter(
    ({ id }, index) => !ids.includes(id, index + 1)
  );

  return fetchedMessages;
};

export { getChannelMessages };
