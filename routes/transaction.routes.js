import express from "express";
import {
  create,
  getAll,
  getByAccount,
  getByAgent,
  getByCustomer,
  getByLoan,
  getOne,
  remove,
  txnHistoryByAgent,
  update,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.get("/customer/:customerId", getByCustomer);
router.get("/agent/:agentId", getByAgent);
router.get("/account/:accountId", getByAccount);
router.get("/loan/:loanId", getByLoan);
router.get("/history/:agentId", txnHistoryByAgent);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
