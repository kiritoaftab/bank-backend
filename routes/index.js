import expressRouter from "express";

import authRouter from "./auth.routes.js";
import agentRouter from "./agent.routes.js";
import userRouter from "./user.routes.js";
import customerRouter from "./customer.routes.js";
import accountRouter from "./account.routes.js";
import loanRouter from "./loan.routes.js";
import transactionRouter from "./transaction.routes.js";
import metricRouter from "./metrics.routes.js";

const router = expressRouter();
router.use("/auth", authRouter);
router.use("/agent", agentRouter);
router.use("/user", userRouter);
router.use("/customer", customerRouter);
router.use("/account", accountRouter);
router.use("/loan", loanRouter);
router.use("/transaction", transactionRouter);
router.use("/metric", metricRouter);

export default router;
