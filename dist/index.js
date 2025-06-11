"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
dotenv_1.default.config();
console.log(process.env.mongo_uri);
app.get("/api/v1/signup", (req, res) => { });
app.get("/api/v1/signin", (req, res) => { });
app.get("/api/v1/content", (req, res) => { });
app.listen(process.env.port, () => {
    console.log("Started server on port " + process.env.port);
});
