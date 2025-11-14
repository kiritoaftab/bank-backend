import expressRouter from "express";

import authRouter from "./auth.routes.js";
import agentRouter from "./agent.routes.js";

const router = expressRouter();
router.use("/auth", authRouter);
router.use("/agent", agentRouter);

export default router;
