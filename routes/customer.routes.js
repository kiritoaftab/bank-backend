import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getByUser,
  getByAgent,
  getByAgentAndSeach,
  getBySearch,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/search", getByAgentAndSeach);
router.get("/searchQuery", getBySearch);
router.get("/:id", getOne);
router.get("/user/:userId", getByUser);
router.get("/agent/:agentId", getByAgent);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
