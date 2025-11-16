import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionBetweenDatesForAgent,
  getTransactionByAccount,
  getTransactionByAgent,
  getTransactionByCustomer,
  getTransactionById,
  getTransactionByLoan,
  updateTransaction,
} from "../services/transaction.service.js";

export async function create(req, res) {
  try {
    const result = await createTransaction(req.body);
    res.json({ message: "Transaction created successfully", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const transactions = await getAllTransactions();
    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const transaction = await getTransactionById(req.params.id);
    res.json({ transaction });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByCustomer(req, res) {
  try {
    console.log(req.params);
    const transactions = await getTransactionByCustomer(req.params.customerId);
    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByAgent(req, res) {
  try {
    console.log(req.params);
    const transactions = await getTransactionByAgent(req.params.agentId);
    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByAccount(req, res) {
  try {
    console.log(req.params);
    const transactions = await getTransactionByAccount(req.params.accountId);
    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByLoan(req, res) {
  try {
    console.log(req.params);
    const transactions = await getTransactionByLoan(req.params.loanId);
    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const transaction = await updateTransaction(req.params.id, req.body);
    res.json({ message: "Transaction updated", transaction });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const response = await deleteTransaction(req.params.id);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function txnHistoryByAgent(req, res) {
  try {
    const { agentId } = req.params;
    const { startDate, endDate, page, pageSize } = req.query;
    console.log(agentId, startDate, endDate, page, pageSize);
    const transactions = await getTransactionBetweenDatesForAgent(
      agentId,
      startDate,
      endDate,
      page,
      pageSize
    );
    res.json({ transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
