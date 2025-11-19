import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByUserId,
  updateCustomer,
  deleteCustomer,
  getCustomerByAgentId,
  getCustomerByAgentIdAndName,
  getCustomerByQuery,
} from "../services/customer.service.js";

export async function create(req, res) {
  try {
    const result = await createCustomer(req.body);
    res.json({ message: "Agent created successfully", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const customers = await getAllCustomers();
    res.json({ customers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const customer = await getCustomerById(req.params.id);
    res.json({ customer });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function getByUser(req, res) {
  try {
    const customer = await getCustomerByUserId(req.params.userId);
    res.json({ customer });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const customer = await updateCustomer(req.params.id, req.body);
    res.json({ message: "Customer updated", customer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const response = await deleteCustomer(req.params.id);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByAgent(req, res) {
  try {
    const { page, pageSize } = req.query;
    const response = await getCustomerByAgentId(
      req.params.agentId,
      page,
      pageSize
    );
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByAgentAndSeach(req, res) {
  try {
    const { searchQuery, agentId } = req.query;
    const customers = await getCustomerByAgentIdAndName(agentId, searchQuery);
    res.json({ customers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getBySearch(req, res) {
  try {
    const { searchQuery } = req.query;
    const customers = await getCustomerByQuery(searchQuery);
    res.json({ customers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
