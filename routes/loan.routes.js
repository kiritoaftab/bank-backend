import express from "express";
import {
  create,
  getAll,
  getByCustomer,
  getOne,
  remove,
  update,
} from "../controllers/loan.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.get("/customer/:customerId", getByCustomer);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
