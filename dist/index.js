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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const db_1 = require("./database/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware_1 = require("./Middlewares/userMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const userSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, { message: "username too small" })
        .max(10, { message: "username too large" }),
    password: zod_1.z
        .string()
        .min(8, { message: "password too small" })
        .max(20, { message: "password too large" })
        .refine((val) => {
        return /[a-z]/.test(val) && /[A-Z]/.test(val);
    }, { message: "single uppercase and lowercase letter required" }),
});
app.use(express_1.default.json());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = userSchema.safeParse(req.body);
        const temp = yield db_1.UserModel.findOne({
            username: req.body.username,
        });
        if (temp) {
            res.status(403).json({
                message: "user already exists",
            });
        }
        else {
            if (user.success) {
                bcrypt_1.default.hash(req.body.password, 10, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        res.json({
                            error: err,
                        });
                    }
                    else {
                        yield db_1.UserModel.create({
                            username: req.body.username,
                            password: hash,
                        });
                        res.status(200).json({
                            message: "user created",
                        });
                    }
                }));
            }
            else if (!user.success) {
                const errormessages = user.error.issues.map((x) => x.message);
                res.status(411).json({
                    error: errormessages,
                });
            }
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Server error",
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = yield db_1.UserModel.findOne({
            username: username,
        });
        if (user) {
            bcrypt_1.default.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jsonwebtoken_1.default.sign({
                        userId: user._id,
                        username: username,
                        password: password,
                    }, process.env.JWT_SECRET);
                    res.status(200).json({
                        token: token,
                    });
                }
                else {
                    res.status(403).json({
                        message: "wrong password",
                    });
                }
            });
        }
        else {
            res.status(403).json({
                message: "user not found",
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: `server error ${e}`,
        });
    }
}));
app.post("/content", userMiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body;
    console.log(content);
    yield db_1.ContentModel.create({
        link: req.body.link,
        type: req.body.type,
        title: req.body.title,
        userId: req.userId,
        tags: [],
    });
    res.json({
        message: "content created",
    });
}));
app.get("/contents", userMiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.userId);
    const contents = yield db_1.ContentModel.find({
        userId: req.userId
    }).populate('userId', 'username');
    res.json({
        contents: contents
    });
}));
app.delete("/contents", userMiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const delteedcontent = yield db_1.ContentModel.deleteOne({
        _id: req.body.ContentId,
        userId: req.userId
    });
    console.log(delteedcontent);
    if (delteedcontent.deletedCount > 0) {
        res.json({
            message: "content deleted"
        });
    }
    else {
        res.json({
            message: "improper content id"
        });
    }
}));
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log("server started on port " + process.env.PORT);
        });
    });
}
