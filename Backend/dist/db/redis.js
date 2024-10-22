"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@redis/client");
class RedisClient {
    constructor() {
        // Create a new Redis client
        this.client = (0, client_1.createClient)({
            url: 'redis://127.0.0.1:6379', // Point to the correct Redis server
        });
        this.isClientConnected = false;
        // Listen for the 'error' event
        this.client.on('error', (err) => {
            console.error(`Redis client not connected to the server: ${err.message}`);
            this.isClientConnected = false;
        });
        // Listen for the 'connect' event
        this.client.on('connect', () => {
            console.log('Redis client connected to the server');
            this.isClientConnected = true;
        });
        // Connect the client
        this.client.connect().catch((err) => {
            console.error(`Error during Redis connection: ${err.message}`);
        });
    }
    isAlive() {
        return this.isClientConnected;
    }
    set(key, val, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAlive()) {
                throw new Error('Redis client is not connected');
            }
            return yield this.client.setEx(key, duration, val); // Redis v4 uses setEx for setting expiry
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAlive()) {
                throw new Error('Redis client is not connected');
            }
            return yield this.client.get(key);
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAlive()) {
                throw new Error('Redis client is not connected');
            }
            yield this.client.del(key);
        });
    }
}
const redisClient = new RedisClient();
exports.default = redisClient;
