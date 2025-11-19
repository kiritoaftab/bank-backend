import express from "express";
import {
  create,
  getAccountsByCustomerAll,
  getAll,
  getByCustomer,
  getOne,
  remove,
  update,
} from "../controllers/account.controller.js";
import { getAccountByQuery } from "../services/account.service.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/searchQuery", getAccountByQuery);
router.get("/:id", getOne);
router.get("/customer/:customerId", getByCustomer);
router.get("/allAccountByCustomer/:customerId", getAccountsByCustomerAll);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
