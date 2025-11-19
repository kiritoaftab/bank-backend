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
import { Parser as Json2CsvParser } from "json2csv";

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

async function getCsvRows(txns) {
  const rows = txns.map((t) => ({
    // Transaction fields
    transaction_id: t.id,
    amount: t.amount,
    mode: t.mode,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,

    // Customer fields
    customer_id: t.customer_id,
    customer_firstName: t.Customer?.User?.firstName || "",
    customer_lastName: t.Customer?.User?.lastName || "",
    customer_phone: t.Customer?.User?.phone || "",
    customer_email: t.Customer?.User?.email || "",

    // Agent fields
    agent_id: t.agent_id,
    agent_firstName: t.Agent?.User?.firstName || "",
    agent_lastName: t.Agent?.User?.lastName || "",
    agent_phone: t.Agent?.User?.phone || "",

    // Account fields (if exists)
    account_id: t.account_id || "",
    account_number: t.Account?.accountNumber || "",
    account_type: t.Account?.accountType || "",
    account_balance: t.Account?.balance || "",
    account_code: t.Account?.accountCode || "",

    // Loan fields (if exists)
    loan_id: t.loan_id || "",
    loan_accountNumber: t.Loan?.accountNumber || "",
    loan_amount: t.Loan?.loanAmount || "",
    loan_pendingDue: t.Loan?.pendingDue || "",
    loan_prevDue: t.Loan?.prevDue || "",
  }));
  return rows;
}

export async function generateOverallTransactionReport(startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const txns = await Transaction.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Customer,
          include: [{ model: User }],
        },
        {
          model: Agent,
          include: [{ model: User }],
        },
        { model: Account },
        { model: Loan },
      ],
      order: [["createdAt", "ASC"]],
    });
    console.log("Transactions fetched for report:", txns.length);

    // Transform into a flat structure for CSV
    const rows = await getCsvRows(txns);
    // Create CSV
    const parser = new Json2CsvParser({ header: true });
    const csv = parser.parse(rows);

    return csv; // You can write to file or upload to Azure
  } catch (err) {
    throw new Error("Failed to generate report: " + err.message);
  }
}

export async function generateReportByAgent(agentId, startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const txns = await Transaction.findAll({
      where: {
        agent_id: agentId,
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Customer,
          include: [{ model: User }],
        },
        {
          model: Agent,
          include: [{ model: User }],
        },
        { model: Account },
        { model: Loan },
      ],
      order: [["createdAt", "ASC"]],
    });
    console.log("Transactions fetched for report:", txns.length);

    // Transform into a flat structure for CSV
    const rows = await getCsvRows(txns);
    // Create CSV
    const parser = new Json2CsvParser({ header: true });
    const csv = parser.parse(rows);

    return csv; // You can write to file or upload to Azure
  } catch (err) {
    throw new Error("Failed to generate report: " + err.message);
  }
}

export async function generateReportByCustomer(customerId, startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const txns = await Transaction.findAll({
      where: {
        customer_id: customerId,
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Customer,
          include: [{ model: User }],
        },
        {
          model: Agent,
          include: [{ model: User }],
        },
        { model: Account },
        { model: Loan },
      ],
      order: [["createdAt", "ASC"]],
    });
    console.log("Transactions fetched for report:", txns.length);

    // Transform into a flat structure for CSV
    const rows = await getCsvRows(txns);
    // Create CSV
    const parser = new Json2CsvParser({ header: true });
    const csv = parser.parse(rows);

    return csv; // You can write to file or upload to Azure
  } catch (err) {
    throw new Error("Failed to generate report: " + err.message);
  }
}

export async function generateReportByAccountNumber(
  accountNumber,
  startDate,
  endDate
) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const txns = await Transaction.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Account,
          required: false,
          where: { accountNumber: accountNumber },
        },
        {
          model: Loan,
          required: false,
          where: { accountNumber: accountNumber },
        },
        {
          model: Customer,
          include: [{ model: User }],
        },
        {
          model: Agent,
          include: [{ model: User }],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    console.log("Transactions fetched for report:", txns.length);

    const rows = await getCsvRows(txns);

    const parser = new Json2CsvParser({ header: true });
    const csv = parser.parse(rows);

    return csv;
  } catch (err) {
    throw new Error("Failed to generate report: " + err.message);
  }
}
