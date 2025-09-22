const { createClient } = require('redis');
require('dotenv').config();

class RedisClient {
  constructor() {
    this.client = null;
  }

  async connect() {
    try {
      // Check if using Upstash Redis (URL format)
      if (process.env.REDIS_HOST && process.env.REDIS_HOST.startsWith('https://')) {
        const redisUrl = `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST.replace('https://', '')}:${process.env.REDIS_PORT}`;
        this.client = createClient({
          url: redisUrl,
          socket: {
            tls: true,
            rejectUnauthorized: false
          }
        });
      } else {
        // Local Redis or standard Redis
        this.client = createClient({
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD || undefined,
        });
      }

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      this.client.on('connect', () => {
        console.log('Connected to Redis successfully');
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      console.log('Redis connection closed');
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    return this.client;
  }
}

module.exports = new RedisClient();