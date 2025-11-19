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

export async function getTransactionBetweenDatesForAgent(
  agentId,
  startDate,
  endDate,
  page = 1,
  pageSize = 10
) {
  try {
    console.log(agentId, startDate, endDate, page, pageSize, "Service");
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const whereClause = {
      agent_id: agentId,
      createdAt: {
        [Op.between]: [start, end],
      },
    };

    const { rows: transactions, count: totalRecords } =
      await Transaction.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          { model: Customer, include: [{ model: User }] },
          { model: Agent, include: [{ model: User }] },
          { model: Account },
          { model: Loan },
        ],
      });

    const totalSum = await Transaction.sum("amount", {
      where: whereClause,
    });

    const totalPages = Math.ceil(totalRecords / pageSize);

    return {
      pagination: {
        page,
        pageSize,
        totalPages,
        totalRecords,
      },
      totalSum,
      transactions,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch transactions: " + err.message);
  }
}

export async function fetchTransactionRatioCollectedByAgent(agentId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTransactionCount = await Transaction.count({
      where: {
        agent_id: agentId,
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    const customers = await Customer.findAll({
      where: { agent_id: agentId },
      attributes: ["id"],
    });

    const customerIds = customers.map((c) => c.id);

    let totalAccounts = 0;

    if (customerIds.length > 0) {
      totalAccounts = await Account.count({
        where: {
          customer_id: {
            [Op.in]: customerIds,
          },
        },
      });
    }
    return {
      agentId,
      todayTransactionCount,
      totalAccounts,
    };
  } catch (err) {
    throw new Error("Failed to fetch agent transaction ratio: " + err.message);
  }
}

export async function getTransactionByQuery(searchQuery) {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Account,
          required: false,
          where: {
            accountNumber: { [Op.like]: `%${searchQuery}%` },
          },
        },
        {
          model: Loan,
          required: false,
          where: {
            accountNumber: { [Op.like]: `%${searchQuery}%` },
          },
        },
        // Optional includes if you want more data:
        {
          model: Customer,
          include: [{ model: User }],
        },
        {
          model: Agent,
          include: [{ model: User }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return transactions;
  } catch (err) {
    throw new Error("Failed to fetch transactions: " + err.message);
  }
}
