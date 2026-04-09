import { Router } from "express";
import { parseJD } from "../controllers/ai.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);
router.post("/parse", parseJD);

export default router;
