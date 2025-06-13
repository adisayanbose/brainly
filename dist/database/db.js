"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksModel = exports.TagsModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const ContentTypes = ['image', 'video', 'article', 'audio'];
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const ContentSchema = new mongoose_1.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: ContentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true }
});
const TagsSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true }
});
const LinksSchema = new mongoose_1.Schema({
    hashedlink: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.Types.ObjectId, required: true, ref: 'User' }
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
exports.TagsModel = (0, mongoose_1.model)("Tags", TagsSchema);
exports.LinksModel = (0, mongoose_1.model)("Links", LinksSchema);
