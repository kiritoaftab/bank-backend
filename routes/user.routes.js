import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getStaffAll,
  getByName,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/staff/", getStaffAll);
router.get("/searchQuery", getByName);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
