import axios from "axios";

const url = `http://127.0.0.1:3002/`;

export const request = (query: string, token?: string) =>
  axios({
    url,
    method: "post",
    data: { query },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((res) => res.data);
