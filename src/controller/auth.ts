// ./src/controller/auth.ts
require('dotenv').config();
import { Request, Response, NextFunction } from "express";
const crypto = require("crypto-js");
import db from "../utils/db";
import { generateTokens } from "../utils/generateToken";

export const getAllUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const allUsers = await db.myUser.findMany();
    console.log(allUsers);
    res.json({ user: allUsers });
};

export const Register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, password } = req.body;

        const existingUser = await db.myUser.findUnique({
            where: {
                username: username,
            },
        });
        if (existingUser) {
            return res.status(409).send("User already exists. Please login");
        } else {
            const hashedPassword = await crypto.SHA256(password).toString();

            await db.myUser.create({
                data: {
                    username: username,
                    password: hashedPassword,
                },
            });

            return res.status(201).send({ message: "register complete" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
};

export const Login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, password } = req.body;

        const user = await db.myUser.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const hashedPassword = await crypto.SHA256(password).toString();

        if (hashedPassword !== user.password) {
            return res.status(401).send("Invalid credentials");
        }

        const tokens = generateTokens(user);
        
        const connection = await db.myUser.update({
            where: { id: user.id },
            data: { refreshtoken: tokens.refreshToken }
        });

        return res.status(200).json({
            accesstoken: tokens.accessToken,
            refreshtoken: tokens.refreshToken,
          });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}