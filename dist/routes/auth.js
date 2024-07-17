"use strict";
// ./src/routes/auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controller/auth");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/user", auth_1.getAllUser);
router.post("/register", auth_1.Register);
router.post("/login", auth_1.Login);
exports.default = router;
