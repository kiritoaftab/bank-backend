import expressRouter from "express";

import authRouter from "./auth.routes.js";

const router = expressRouter();
router.use("/auth", authRouter);

export default router;
