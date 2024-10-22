"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require("../db/mongo");
const index_1 = __importDefault(require("../routes/index"));
const cors_1 = __importDefault(require("cors"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
require('dotenv').config();
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET, POST, PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use('/public', express_1.default.static('public'));
app.listen(PORT, () => {
    console.log(`Server is starting at port:${PORT}`);
});
app.use('/', index_1.default);
exports.default = app;
