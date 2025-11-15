import {
  createLoan,
  getLoanById,
  getAllLoans,
  getLoansByCustomer,
  updateLoan,
  deleteLoan,
} from "../services/loan.service.js";

export async function create(req, res) {
  try {
    const result = await createLoan(req.body);
    res.json({ message: "Loan created successfully", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const loans = await getAllLoans();
    res.json({ loans });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const loan = await getLoanById(req.params.id);
    res.json({ loan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByCustomer(req, res) {
  try {
    console.log(req.params);
    const loans = await getLoansByCustomer(req.params.customerId);
    res.json({ loans });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const loan = await updateLoan(req.params.id, req.body);
    res.json({ message: "Loan updated", loan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const response = await deleteLoan(req.params.id);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
