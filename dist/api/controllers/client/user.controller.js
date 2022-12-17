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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserProfilePicture = exports.changeUserProfilePicture = exports.updateUserAccountDetails = void 0;
// Services
const client_1 = require("../../services/client");
// Utils
const utils_1 = require("../../utils");
const updateUserAccountDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { full_name, contact, birth_date } = req.body;
    const userSub = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.sub;
    try {
        if (req.auth === undefined) {
            throw new utils_1.ErrorObj.ServerError("Failed to check user authority, please try again.");
        }
        const updatedUserAccountDetailsData = [full_name, contact, birth_date];
        const result = yield client_1.userService.updateUserAccountDetails(updatedUserAccountDetailsData, userSub);
        res.status(200).json({
            status: "success",
            data: { updatedAccountDetails: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.updateUserAccountDetails = updateUserAccountDetails;
const changeUserProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const userEmail = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
    const userCurrentPicture = ((_c = req.user) === null || _c === void 0 ? void 0 : _c.profile_picture) || "";
    try {
        const image = req.file;
        if (userEmail === undefined) {
            throw new utils_1.ErrorObj.ServerError("Failed to check user authority, please try again.");
        }
        const result = yield client_1.userService.changeUserProfilePicture(image, userEmail, userCurrentPicture);
        res.status(200).json({
            status: "success",
            data: { updatedAccountDetails: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.changeUserProfilePicture = changeUserProfilePicture;
const deleteUserProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    const userEmail = (_d = req.user) === null || _d === void 0 ? void 0 : _d.email;
    const userCurrentPicture = ((_e = req.user) === null || _e === void 0 ? void 0 : _e.profile_picture) || "";
    try {
        if (userEmail === undefined) {
            throw new utils_1.ErrorObj.ServerError("Failed to check user authority, please try again.");
        }
        const result = yield client_1.userService.deleteUserProfilePicture(userEmail, userCurrentPicture);
        res.status(200).json({
            status: "success",
            data: { updatedAccountDetails: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.deleteUserProfilePicture = deleteUserProfilePicture;
