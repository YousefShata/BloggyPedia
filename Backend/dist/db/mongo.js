"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class DBClient {
    constructor() {
        this.isConnected = false;
        this.db = null;
        const uri = 'mongodb://localhost:27017/BloggyPedia';
        mongoose_1.default.connect(uri).then(() => {
            this.isConnected = true;
            this.db = this.client.db('BloggyPedia');
        })
            .catch(() => {
            this.isConnected = false;
        });
    }
    isDatabaseConnected() {
        return this.isConnected;
    }
    // Example method to get the database connection
    getDbConnection() {
        return this.db;
    }
}
const dbClient = new DBClient();
exports.default = mongoose_1.default;
