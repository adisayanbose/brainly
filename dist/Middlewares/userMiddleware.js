"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMiddleware = UserMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function UserMiddleware(req, res, next) {
    const token = req.headers.token;
    if (!process.env.JWT_SECRET) {
        throw new Error("jwt_Secret is missing");
    }
    const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (user) {
        if (typeof user != "string") {
            req.userId = user.userId;
        }
        next();
    }
    else {
        res.json({
            message: "you are not logged in",
        });
    }
}
