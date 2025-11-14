import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getByUser,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.get("/user/:userId", getByUser);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
