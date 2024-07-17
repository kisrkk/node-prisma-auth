"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ./src/utils/db.ts
const client_1 = require("@prisma/client");
const db = new client_1.PrismaClient();
exports.default = db;
