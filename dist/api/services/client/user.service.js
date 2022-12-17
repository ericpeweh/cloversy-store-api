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
// Dependencies
const fs_1 = __importDefault(require("fs"));
// Data
const client_1 = require("../../data/client");
// Config
const cloudStorage_1 = __importDefault(require("../../../config/cloudStorage"));
const updateUserAccountDetails = (updatedUserAccountDetailsData, userSub) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield client_1.userRepo.updateUserAccountDetails(updatedUserAccountDetailsData, userSub);
    return userData;
});
exports.updateUserAccountDetails = updateUserAccountDetails;
const changeUserProfilePicture = (image, userEmail, userCurrentPicture) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userCurrentPicture.includes("s.gravatar.com") && userCurrentPicture) {
        yield cloudStorage_1.default
            .file(userCurrentPicture.replace("https://storage.googleapis.com/cloversy-store/", ""))
            .delete();
    }
    const cloudImageResponse = yield cloudStorage_1.default.upload(image.path, {
        destination: `users/user-${userEmail}-${image.filename}.jpeg`
    });
    const userData = yield client_1.userRepo.changeUserProfilePicture(userEmail, cloudImageResponse);
    fs_1.default.unlink(image.path, () => { });
    return userData;
});
exports.changeUserProfilePicture = changeUserProfilePicture;
const deleteUserProfilePicture = (userEmail, userCurrentPicture) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userCurrentPicture.includes("s.gravatar.com") && userCurrentPicture) {
        yield cloudStorage_1.default
            .file(userCurrentPicture.replace("https://storage.googleapis.com/cloversy-store/", ""))
            .delete();
    }
    const userData = yield client_1.userRepo.deleteUserProfilePicture(userEmail);
    return userData;
});
exports.deleteUserProfilePicture = deleteUserProfilePicture;
