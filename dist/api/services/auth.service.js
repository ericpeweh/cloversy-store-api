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
exports.resetPasswordAuth0 = exports.getUserInfoAuth0 = void 0;
// Dependencies
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getUserInfoAuth0 = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get("https://dev-yinr7e34g2h7igf4.us.auth0.com/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
});
exports.getUserInfoAuth0 = getUserInfoAuth0;
const resetPasswordAuth0 = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post("https://dev-yinr7e34g2h7igf4.us.auth0.com/dbconnections/change_password", {
        client_id: process.env.AUTH0_CLIENTID,
        email: userEmail,
        connection: "Username-Password-Authentication"
    }, {
        headers: { "content-type": "application/json" }
    });
    return response.data;
});
exports.resetPasswordAuth0 = resetPasswordAuth0;
