"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const dotenv_1 = __importDefault(require("dotenv"));
const storage_1 = require("@google-cloud/storage");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// Initialization
const storage = new storage_1.Storage({
    keyFilename: path_1.default.join(process.cwd(), process.env.GOOGLE_CLOUD_KEY_PATH),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
exports.default = bucket;
