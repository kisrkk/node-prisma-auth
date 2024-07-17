"use strict";
// ./src/routes/auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controller/auth");
const express_1 = __importDefault(require("express"));
const refreshTokenValidate_1 = __importDefault(require("../middleware/refreshTokenValidate"));
const router = express_1.default.Router();
router.get("/user", auth_1.getAllUser);
router.post("/register", auth_1.Register);
router.post("/login", auth_1.Login);
router.post("/refresh", refreshTokenValidate_1.default, auth_1.refreshToken);
exports.default = router;
