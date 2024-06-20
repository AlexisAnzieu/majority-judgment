import { kv } from "@vercel/kv";

export const set = async (key = "none", value: any, expirationInDays = 1) => {
  try {
    return await kv.set(key, value, { ex: 60 * 60 * 24 * expirationInDays });
  } catch (error) {
    console.log(error);
  }
};

export const get = async (key: string) => {
  try {
    return await kv.get(key);
  } catch (error) {
    console.log(error);
  }
};
