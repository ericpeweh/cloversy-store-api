"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getLocalTime = () => {
    const timezoneOffsetInMs = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - timezoneOffsetInMs).toISOString().slice(0, -1);
    return localISOTime;
};
exports.default = getLocalTime;
