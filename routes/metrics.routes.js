import express from "express";
import {
  metricCounts,
  sumOfTransaction,
  topAgentYesterday,
} from "../controllers/metrics.controller.js";

const router = express.Router();

router.get("/transactionSum", sumOfTransaction);
router.get("/metricCounts", metricCounts);
router.get("/topAgent", topAgentYesterday);
export default router;
