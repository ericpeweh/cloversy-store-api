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
exports.getShippingWaybill = exports.getShippingCostBySubdistrict = exports.getSubdistrictByCityId = exports.getCitiesByProvinceId = exports.getAllProvinces = void 0;
// Data
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RAJA_ONGKIR_BASE_URL = "https://pro.rajaongkir.com/api";
const getAllProvinces = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${RAJA_ONGKIR_BASE_URL}/province`, {
            headers: {
                key: process.env.RAJA_ONGKIR_API_KEY
            }
        });
        return response.data.rajaongkir.results;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllProvinces = getAllProvinces;
const getCitiesByProvinceId = (provinceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${RAJA_ONGKIR_BASE_URL}/city?province=${provinceId}`, {
            headers: {
                key: process.env.RAJA_ONGKIR_API_KEY
            }
        });
        return response.data.rajaongkir.results;
    }
    catch (error) {
        throw error;
    }
});
exports.getCitiesByProvinceId = getCitiesByProvinceId;
const getSubdistrictByCityId = (subdistrictId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${RAJA_ONGKIR_BASE_URL}/subdistrict?city=${subdistrictId}`, {
            headers: {
                key: process.env.RAJA_ONGKIR_API_KEY
            }
        });
        return response.data.rajaongkir.results;
    }
    catch (error) {
        throw error;
    }
});
exports.getSubdistrictByCityId = getSubdistrictByCityId;
const getShippingCostBySubdistrict = (subdistrictId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const costPromises = [];
        ["jne", "jnt", "sicepat"].forEach(courierService => {
            const request = axios_1.default.post(`${RAJA_ONGKIR_BASE_URL}/cost`, {
                origin: 5106,
                originType: "subdistrict",
                destination: subdistrictId,
                destinationType: "subdistrict",
                // Calculated for all shipping
                weight: 2000,
                courier: courierService,
                length: 40,
                width: 30,
                height: 30
            }, {
                headers: {
                    key: process.env.RAJA_ONGKIR_API_KEY
                }
            });
            costPromises.push(request);
        });
        const costResponses = yield Promise.all(costPromises);
        // Structure result item
        const result = costResponses.reduce((arr, response) => {
            const costItem = response.data.rajaongkir.results[0];
            const structuredCosts = costItem.costs.map((costArrItem) => (Object.assign(Object.assign(Object.assign({}, costArrItem.cost[0]), { courier: costItem.code, service: costArrItem.service, description: costArrItem.description }), (costItem.code === "J&T" && { etd: "2-3" }))));
            return [...arr, ...structuredCosts];
        }, []);
        // Remove Cargo shipping from SiCepat
        return result.filter(cost => cost.service !== "GOKIL");
    }
    catch (error) {
        throw error;
    }
});
exports.getShippingCostBySubdistrict = getShippingCostBySubdistrict;
const getShippingWaybill = (trackingCode, courierName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(`${RAJA_ONGKIR_BASE_URL}/waybill`, {
            waybill: trackingCode,
            courier: courierName === "J&T" ? "jnt" : courierName
        }, {
            headers: {
                key: process.env.RAJA_ONGKIR_API_KEY
            }
        });
        return response.data.rajaongkir.result.manifest;
    }
    catch (error) {
        throw error;
    }
});
exports.getShippingWaybill = getShippingWaybill;
