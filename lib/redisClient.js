import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Global singleton Redis client for Next.js hot-reloading
let redisClient = null;

export function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null; // stop retrying after 3 attempts
        return Math.min(times * 100, 1000);
      },
      lazyConnect: true,
    });

    redisClient.on('error', (err) => {
      console.warn('[Redis] Connection warning:', err.message);
    });
  }
  return redisClient;
}

export async function checkRedisStatus() {
  try {
    const client = getRedisClient();
    if (client.status === 'wait') {
      await client.connect();
    }
    const pong = await client.ping();
    return { connected: pong === 'PONG', url: redisUrl, status: client.status };
  } catch (err) {
    return { connected: false, error: err.message, url: redisUrl };
  }
}
