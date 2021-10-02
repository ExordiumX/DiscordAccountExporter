import axios from "axios";

const getFriends = async (token) => {
  let res = await axios.get(
    "https://discord.com/api/v9/users/@me/relationships",
    {
      headers: { authorization: token, "content-type": "application/json" },
    }
  );
  console.log(res.data);
  return res;
};
