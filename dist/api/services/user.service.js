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
exports.updateUser = exports.createNewUser = exports.getUserDataById = exports.getUserDataBySub = exports.getUserDataByEmail = exports.getAllCustomers = void 0;
// Data
const data_1 = require("../data");
// Utils
const getLocalTime_1 = __importDefault(require("../utils/getLocalTime"));
const getAllCustomers = (page, searchQuery, statusQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const customers = yield data_1.userRepo.getAllCustomers(page, searchQuery, statusQuery);
    return customers;
});
exports.getAllCustomers = getAllCustomers;
const getUserDataByEmail = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield data_1.userRepo.getUserDataByEmail(userEmail);
    return userData.rows[0];
});
exports.getUserDataByEmail = getUserDataByEmail;
const getUserDataBySub = (userSub) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield data_1.userRepo.getUserDataBySub(userSub);
    return userData.rows[0];
});
exports.getUserDataBySub = getUserDataBySub;
const getUserDataById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield data_1.userRepo.getUserDataById(userId);
    return Object.assign(Object.assign({}, userData.userResult.rows[0]), { address: userData.addressResult.rows, lastSeen: userData.lastSeenResult.rows, wishlist: userData.wishlistResult.rows, vouchers: userData.vouchersResult.rows });
});
exports.getUserDataById = getUserDataById;
const createNewUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield data_1.userRepo.createNewUser(userData);
    return newUser.rows[0];
});
exports.createNewUser = createNewUser;
const updateUser = (updatedUserData, userId, prev_status) => __awaiter(void 0, void 0, void 0, function* () {
    // User status case
    if (prev_status === "banned" && updatedUserData.user_status === "active") {
        updatedUserData.banned_date = null;
    }
    if (prev_status === "active" && updatedUserData.user_status === "banned") {
        updatedUserData.banned_date = (0, getLocalTime_1.default)();
    }
    const userResult = yield data_1.userRepo.updateUser(updatedUserData, userId);
    return userResult.rows[0];
});
exports.updateUser = updateUser;
