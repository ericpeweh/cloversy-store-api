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
exports.deleteUserProfilePicture = exports.changeUserProfilePicture = exports.updateUserAccountDetails = void 0;
// Config
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
const updateUserAccountDetails = (updatedUserAccountDetailsData, userSub) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = `UPDATE users 
    SET full_name = $1, contact = $2, birth_date = $3
    WHERE sub = $4
    RETURNING *
  `;
    const userResult = yield connectDB_1.default.query(userQuery, [...updatedUserAccountDetailsData, userSub]);
    return userResult;
});
exports.updateUserAccountDetails = updateUserAccountDetails;
const changeUserProfilePicture = (userEmail, cloudImageResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const imageQuery = `UPDATE users
    SET profile_picture = $1
    WHERE email = $2
    RETURNING *
  `;
    const userData = yield connectDB_1.default.query(imageQuery, [
        `https://storage.googleapis.com/cloversy-store/${cloudImageResponse[1].name}`,
        userEmail
    ]);
    return userData;
});
exports.changeUserProfilePicture = changeUserProfilePicture;
const deleteUserProfilePicture = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const imageQuery = `UPDATE users
    SET profile_picture = NULL
    WHERE email = $1
    RETURNING *
  `;
    const userData = yield connectDB_1.default.query(imageQuery, [userEmail]);
    return userData;
});
exports.deleteUserProfilePicture = deleteUserProfilePicture;
