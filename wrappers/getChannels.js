import axios from "axios";

const getChannels = async (token) => {
  let { data } = await axios.get(
    "https://discordapp.com/api/users/@me/channels",
    { headers: { authorization: token, "content-type": "application/json" } }
  );
  return data;
};

const getChannelName = async (token, channelid) => {
  let { data } = await axios.get(
    `https://discord.com/api/v9/channels/${channelid}`,
    {
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
    }
  );
  if (data?.name) {
    return data?.name;
  } else {
    return `${data.recipients[0].username}#${data.recipients[0].discriminator}`;
  }
};

export { getChannels, getChannelName };
