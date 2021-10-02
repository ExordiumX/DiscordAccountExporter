import axios from "axios";

const exportUserInfo = async (token) => {
  const { data } = await axios.get("https://discord.com/api/v9/users/@me", {
    headers: {
      authorization: token,
      "content-type": "application/json",
    },
  });
  return data;
};

export { exportUserInfo };
