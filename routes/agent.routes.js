import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getByUser,
  getBySearch,
} from "../controllers/agent.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/searchQuery", getBySearch);
router.get("/:id", getOne);
router.get("/user/:userId", getByUser);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
