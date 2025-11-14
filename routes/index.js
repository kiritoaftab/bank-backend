import expressRouter from "express";

import authRouter from "./auth.routes.js";
import agentRouter from "./agent.routes.js";
import userRouter from "./user.routes.js";

const router = expressRouter();
router.use("/auth", authRouter);
router.use("/agent", agentRouter);
router.use("/user", userRouter);

export default router;
