import {
  createAccount,
  deleteAccount,
  getAccountById,
  getAccountsByCustomer,
  getAllAccounts,
  getAllAccountsByCustomer,
  updateAccount,
} from "../services/account.service.js";

export async function create(req, res) {
  try {
    const result = await createAccount(req.body);
    res.json({ message: "Account created successfully", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const accounts = await getAllAccounts();
    res.json({ accounts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const account = await getAccountById(req.params.id);
    res.json({ account });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByCustomer(req, res) {
  try {
    console.log(req.params);
    const accounts = await getAccountsByCustomer(req.params.customerId);
    res.json({ accounts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAccountsByCustomerAll(req, res) {
  try {
    const allAccounts = await getAllAccountsByCustomer(req.params.customerId);
    res.json({ allAccounts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const account = await updateAccount(req.params.id, req.body);
    res.json({ message: "Account updated", account });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const response = await deleteAccount(req.params.id);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
