// ./src/routes/auth.ts

import { getAllUser,Login,Register  } from "../controller/auth";
import express from "express";

const router = express.Router();

router.get("/user", getAllUser);
router.post("/register", Register);
router.post("/login", Login);

export default router;