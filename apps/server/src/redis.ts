import { createClient } from "redis"
import config from "./config";

const redis = createClient({
  url: config.redisURL
});

redis.on("error", function (err) {
  throw err;
});
await redis.connect().then(() => { console.log("Connected to Redis") })
export default redis;