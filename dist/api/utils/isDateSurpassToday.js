"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isDateSurpassToday = (dateStr) => {
    const timezoneOffsetInMs = new Date().getTimezoneOffset() * 60000;
    const current = Date.now() - timezoneOffsetInMs;
    const dateToCheck = new Date(dateStr).getTime();
    return current >= dateToCheck;
};
exports.default = isDateSurpassToday;
