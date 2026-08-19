const { createClient } = require("redis");

const redisClient = createClient({
    url : process.env.REDIS_URL || "rediss://default:RS5Xnnd9sAbVzdLYAZ93gmKA2VxrWcgP@quartzose-faultless-use-11194.db.redis.io:12173",
})

redisClient.on("error" , (err) => {
    console.log("Redis Client Error", err)
})

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
}

module.exports = { redisClient, connectRedis }