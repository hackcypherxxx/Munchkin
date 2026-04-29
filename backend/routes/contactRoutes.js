import express from "express";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

// public
router.post("/", createContact);

export default router;