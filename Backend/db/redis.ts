import { createClient } from '@redis/client';

class RedisClient {
    client: any;
    isClientConnected: boolean;

    constructor() {
        const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
        // Create a new Redis client
        this.client = createClient({
            url: redisUrl, // Point to the correct Redis server
        });

        this.isClientConnected = false;

        // Listen for the 'error' event
        this.client.on('error', (err: Error) => {
            console.error(`Redis client not connected to the server: ${err.message}`);
            this.isClientConnected = false;
        });

        // Listen for the 'connect' event
        this.client.on('connect', () => {
            console.log('Redis client connected to the server');
            this.isClientConnected = true;
        });

        // Connect the client
        this.client.connect().catch((err: Error) => {
            console.error(`Error during Redis connection: ${err.message}`);
        });
    }

    isAlive() {
        return this.isClientConnected;
    }

    async set(key: string, val: string, duration: number) {
        if (!this.isAlive()) {
            throw new Error('Redis client is not connected');
        }
        return await this.client.setEx(key, duration, val);  // Redis v4 uses setEx for setting expiry
    }

    async get(key: string) {
        if (!this.isAlive()) {
            throw new Error('Redis client is not connected');
        }
        return await this.client.get(key);
    }
    async del(key: string) {
        if (!this.isAlive()) {
            throw new Error('Redis client is not connected');
        }
         await this.client.del(key);
    }
}

const redisClient = new RedisClient();
export default redisClient;
