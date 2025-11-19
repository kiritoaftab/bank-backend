import {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAgentByUserId,
  getAgentByQuery,
} from "../services/agent.service.js";

export async function create(req, res) {
  try {
    const result = await createAgent(req.body);
    res.json({ message: "Agent created successfully", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const agents = await getAllAgents();
    res.json({ agents });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const agent = await getAgentById(req.params.id);
    res.json({ agent });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function getByUser(req, res) {
  try {
    const agent = await getAgentByUserId(req.params.userId);
    res.json({ agent });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const agent = await updateAgent(req.params.id, req.body);
    res.json({ message: "Agent updated", agent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const response = await deleteAgent(req.params.id);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getBySearch(req, res) {
  try {
    const { searchQuery } = req.query;
    const agents = await getAgentByQuery(searchQuery);
    res.json({ agents });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
