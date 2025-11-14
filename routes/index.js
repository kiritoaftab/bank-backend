import expressRouter from "express";

import authRouter from "./auth.routes.js";
import agentRouter from "./agent.routes.js";
import userRouter from "./user.routes.js";
import customerRouter from "./customer.routes.js";

const router = expressRouter();
router.use("/auth", authRouter);
router.use("/agent", agentRouter);
router.use("/user", userRouter);
router.use("/customer", customerRouter);

export default router;
