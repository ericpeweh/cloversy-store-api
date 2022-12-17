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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserData = exports.getSingleCustomer = exports.getAllCustomers = void 0;
// Services
const services_1 = require("../services");
// Utils
const utils_1 = require("../utils");
// Types
const getAllCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", q: searchQuery = "", status: statusQuery = "" } = req.query;
    try {
        if (typeof searchQuery !== "string" ||
            typeof statusQuery !== "string" ||
            typeof page !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'page', 'q' and 'status' has to be type of string");
        }
        const _a = yield services_1.userService.getAllCustomers(page, searchQuery, statusQuery), { customers } = _a, paginationData = __rest(_a, ["customers"]);
        res.status(200).json(Object.assign(Object.assign({ status: "success" }, paginationData), { data: { customers: customers.rows } }));
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getAllCustomers = getAllCustomers;
const getSingleCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        if (isNaN(parseInt(userId))) {
            throw new utils_1.ErrorObj.ClientError("userId must be number");
        }
        const result = yield services_1.userService.getUserDataById(userId);
        if (result === undefined) {
            throw new utils_1.ErrorObj.ClientError("Customer not found!", 404);
        }
        res.status(200).json({
            status: "success",
            data: { customer: result }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getSingleCustomer = getSingleCustomer;
const updateUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { full_name, contact, profile_picture, user_status, credits, prev_status } = req.body;
    try {
        const updatedUserData = {
            full_name,
            contact,
            profile_picture,
            user_status,
            credits
        };
        const result = yield services_1.userService.updateUser(updatedUserData, userId, prev_status);
        res.status(200).json({
            status: "success",
            data: { updatedCustomer: result }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.updateUserData = updateUserData;
