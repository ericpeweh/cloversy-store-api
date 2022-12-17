"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateUpdateQuery = (tableName, data, identifier, extra, startIndex) => {
    const queryParams = [];
    let query = "";
    let queryIndex = startIndex || 1;
    // Set part
    query += `UPDATE ${tableName} SET`;
    const pairs = Object.entries(data);
    pairs.forEach(([key, value]) => {
        if (value !== undefined) {
            queryParams.push(value);
            query += ` ${key} = $${queryIndex},`;
            queryIndex += 1;
        }
    });
    query = query.slice(0, -1); // remove comma
    // Where part (ex: id)
    if (identifier) {
        query += ` WHERE`;
        const identifierPairs = Object.entries(identifier);
        identifierPairs.forEach(([key, value], index) => {
            if (value !== undefined) {
                queryParams.push(value);
                query += ` ${index > 0 ? "AND" : ""} ${key} = $${queryIndex}`;
                queryIndex += 1;
            }
        });
    }
    // Extra part
    if (extra) {
        query += extra;
    }
    return { query, params: queryParams, index: queryIndex };
};
exports.default = generateUpdateQuery;
