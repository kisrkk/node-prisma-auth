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
exports.refreshToken = exports.Login = exports.Register = exports.getAllUser = void 0;
// ./src/controller/auth.ts
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto = require("crypto-js");
const db_1 = __importDefault(require("../utils/db"));
const generateToken_1 = require("../utils/generateToken");
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield db_1.default.myUser.findMany();
    console.log(allUsers);
    res.json({ user: allUsers });
});
exports.getAllUser = getAllUser;
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield db_1.default.myUser.findUnique({
            where: {
                username: username,
            },
        });
        if (existingUser) {
            return res.status(409).send("User already exists. Please login");
        }
        else {
            const hashedPassword = yield crypto.SHA256(password).toString();
            yield db_1.default.myUser.create({
                data: {
                    username: username,
                    password: hashedPassword,
                },
            });
            return res.status(201).send({ message: "register complete" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
});
exports.Register = Register;
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield db_1.default.myUser.findUnique({
            where: {
                username: username,
            },
        });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const hashedPassword = yield crypto.SHA256(password).toString();
        if (hashedPassword !== user.password) {
            return res.status(401).send("Invalid credentials");
        }
        const tokens = (0, generateToken_1.generateTokens)(user);
        const connection = yield db_1.default.myUser.update({
            where: { id: user.id },
            data: { refreshtoken: tokens.refreshToken }
        });
        return res.status(200).json({
            accesstoken: tokens.accessToken,
            refreshtoken: tokens.refreshToken,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
});
exports.Login = Login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("refresh token work");
        const username = req.user.username;
        let newToken;
        const oldUser = yield db_1.default.myUser.findUnique({
            where: {
                username: req.user.username,
            },
        });
        const oldRefreshToken = oldUser === null || oldUser === void 0 ? void 0 : oldUser.refreshtoken;
        const refreshTokenFromBody = req.body.refreshtoken;
        // Check if refresh token in the request body matches the one in the database
        console.log("Old Refresh Token = " + oldRefreshToken);
        console.log("refresh token from request = " + refreshTokenFromBody);
        if ((oldRefreshToken === null || oldRefreshToken === void 0 ? void 0 : oldRefreshToken.toString()) !== refreshTokenFromBody.toString()) {
            console.log("not same refreshtoken");
            return res.sendStatus(401);
        }
        // Verify the validity of the refresh token
        const isValidRefreshToken = jsonwebtoken_1.default.verify(String(oldRefreshToken), process.env.REFRESH_TOKEN_SECRET);
        if (!isValidRefreshToken) {
            return res.sendStatus(401);
        }
        if (oldUser) {
            const token = (0, generateToken_1.generateTokens)(oldUser);
            newToken = token;
        }
        console.log("New Refresh Token = " + (newToken === null || newToken === void 0 ? void 0 : newToken.refreshToken));
        yield db_1.default.myUser.update({
            where: {
                id: oldUser === null || oldUser === void 0 ? void 0 : oldUser.id,
            },
            data: {
                refreshtoken: newToken === null || newToken === void 0 ? void 0 : newToken.refreshToken,
            },
        });
        const user = {
            username: oldUser === null || oldUser === void 0 ? void 0 : oldUser.username,
            accesstoken: newToken === null || newToken === void 0 ? void 0 : newToken.accessToken,
            refreshtoken: newToken === null || newToken === void 0 ? void 0 : newToken.refreshToken,
        };
        return res.status(201).json(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
});
exports.refreshToken = refreshToken;
