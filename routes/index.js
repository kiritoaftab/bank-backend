import expressRouter from "express";

import authRouter from "./auth.routes.js";
import agentRouter from "./agent.routes.js";
import userRouter from "./user.routes.js";
import customerRouter from "./customer.routes.js";
import accountRouter from "./account.routes.js";

const router = expressRouter();
router.use("/auth", authRouter);
router.use("/agent", agentRouter);
router.use("/user", userRouter);
router.use("/customer", customerRouter);
router.use("/account", accountRouter);

export default router;
