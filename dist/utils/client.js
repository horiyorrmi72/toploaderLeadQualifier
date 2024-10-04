"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retellClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const retell_sdk_1 = __importDefault(require("retell-sdk"));
const retellKey = process.env.RETELL_API_KEY;
exports.retellClient = new retell_sdk_1.default({
    apiKey: process.env.RETELL_API_KEY,
});
// console.log(retellKey);
