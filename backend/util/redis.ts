import { createClient } from 'redis';
const redisClient = createClient();
redisClient.on("error", console.error);
redisClient.connect();

export function set(key: string, value: Object): Promise<string | null> {
  return redisClient.set(key, JSON.stringify(value));
};

export function get(key: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    redisClient.get(key)
      .then(obj => resolve(JSON.parse(obj || "")))
      .catch(err => reject(err));
  });
};

export function del(key: string): Promise<number> {
  return redisClient.del(key);
}
