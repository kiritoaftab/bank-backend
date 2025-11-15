import { Op } from "sequelize";
import {
  sequelize,
  Transaction,
  Account,
  Loan,
  Customer,
  Agent,
  User,
} from "../models/index.js";

export async function createTransaction(data) {
  const {
    customer_id,
    agent_id,
    account_id = null,
    loan_id = null,
    accountType,
    amount,
    mode,
  } = data;

  if (!accountType) throw new Error("accountType is required");
  if (!amount || amount <= 0) throw new Error("Invalid amount");

  const t = await sequelize.transaction();

  try {
    const customer = await Customer.findByPk(customer_id, { transaction: t });
    if (!customer) throw new Error("Customer not found");

    const agent = await Agent.findByPk(agent_id, { transaction: t });
    if (!agent) throw new Error("Agent not found");

    let updatedAccount = null;
    let updatedLoan = null;

    if (accountType !== "LOAN") {
      if (!account_id)
        throw new Error("account_id is required for account transactions");

      const account = await Account.findByPk(account_id, { transaction: t });
      if (!account) throw new Error("Account not found");

      // Update balances
      const newPrevBalance = account.balance;
      const newBalance = parseFloat(account.balance) + parseFloat(amount);

      await account.update(
        {
          prevBalance: newPrevBalance,
          balance: newBalance,
        },
        { transaction: t }
      );

      updatedAccount = account;
    }

    if (accountType === "LOAN") {
      if (!loan_id)
        throw new Error("loan_id is required for loan transactions");

      const loan = await Loan.findByPk(loan_id, { transaction: t });
      if (!loan) throw new Error("Loan not found");

      const newPrevDue = loan.pendingDue;
      let newPendingDue = parseFloat(loan.pendingDue) - parseFloat(amount);

      if (newPendingDue < 0) newPendingDue = 0; // avoid negative due

      await loan.update(
        {
          prevDue: newPrevDue,
          pendingDue: newPendingDue,
        },
        { transaction: t }
      );

      updatedLoan = loan;
    }

    const txn = await Transaction.create(
      {
        customer_id,
        agent_id,
        account_id,
        loan_id,
        amount,
        mode,
      },
      { transaction: t }
    );

    await t.commit();
    return { txn, updatedAccount, updatedLoan };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function getAllTransactions() {
  return Transaction.findAll({
    include: [
      { model: Customer, include: [{ model: User }] },
      { model: Agent, include: [{ model: User }] },
      { model: Account },
      { model: Loan },
    ],
    order: [["id", "DESC"]],
  });
}

export async function getTransactionById(id) {
  const txn = await Transaction.findByPk(id, {
    include: [
      { model: Customer, include: [{ model: User }] },
      { model: Agent, include: [{ model: User }] },
      { model: Account },
      { model: Loan },
    ],
  });

  if (!txn) throw new Error("Transaction not found");
  return txn;
}

export async function getTransactionByCustomer(customerId) {
  const transactions = await Transaction.findAll({
    where: { customer_id: customerId },
    include: [
      { model: Customer, include: [{ model: User }] },
      { model: Agent, include: [{ model: User }] },
      { model: Account },
      { model: Loan },
    ],
  });
  return transactions;
}

export async function getTransactionByAgent(agentId) {
  const transactions = await Transaction.findAll({
    where: { agent_id: agentId },
    include: [
      { model: Customer, include: [{ model: User }] },
      { model: Agent, include: [{ model: User }] },
      { model: Account },
      { model: Loan },
    ],
  });
  return transactions;
}

export async function getTransactionByAccount(accountId) {
  const transactions = await Transaction.findAll({
    // where: {
    //   [Op.or]: [{ account_id: accountId }, { loan_id: accountId }],
    // },
    where: {
      account_id: accountId,
    },
    include: [
      { model: Customer, include: [{ model: User }] },
      { model: Agent, include: [{ model: User }] },
      { model: Account },
      { model: Loan },
    ],
    order: [["id", "DESC"]],
  });

  return transactions;
}

export async function getTransactionByLoan(loanId) {
  const transactions = await Transaction.findAll({
    // where: {
    //   [Op.or]: [{ account_id: accountId }, { loan_id: accountId }],
    // },
    where: {
      loan_id: loanId,
    },
    include: [
      { model: Customer, include: [{ model: User }] },
      { model: Agent, include: [{ model: User }] },
      { model: Account },
      { model: Loan },
    ],
    order: [["id", "DESC"]],
  });

  return transactions;
}

export async function updateTransaction(id, data) {
  const txn = await Transaction.findByPk(id);
  if (!txn) throw new Error("Transaction not found");

  await txn.update(data);
  return getTransactionById(id);
}

export async function deleteTransaction(id) {
  const txn = await Transaction.findByPk(id);
  if (!txn) throw new Error("Transaction not found");

  await txn.destroy();
  return { message: "Transaction deleted successfully" };
}
