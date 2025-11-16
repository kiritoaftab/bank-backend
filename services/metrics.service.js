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

export async function fetchSumOfTransaction() {
  try {
    const totalAmount = await Transaction.sum("amount");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAmount = await Transaction.sum("amount", {
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    const yesterdayStart = new Date(today);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const yesterdayEnd = new Date(today);

    const yesterdayAmount = await Transaction.sum("amount", {
      where: {
        createdAt: {
          [Op.gte]: yesterdayStart,
          [Op.lt]: yesterdayEnd,
        },
      },
    });

    return {
      totalAmount: totalAmount || 0,
      todayAmount: todayAmount || 0,
      yesterdayAmount: yesterdayAmount || 0,
    };
  } catch (error) {
    throw new Error("Failed to fetch transaction sum: " + error.message);
  }
}

export async function fetchCounts() {
  try {
    const accountCount = await Account.count();
    const loanCount = await Loan.count();
    const agentCount = await Agent.count();
    const customerCount = await Customer.count();

    return {
      accounts: accountCount,
      loans: loanCount,
      agents: agentCount,
      customers: customerCount,
    };
  } catch (error) {
    throw new Error("Failed to fetch counts: " + error.message);
  }
}

export async function fetchTopAgentYesterday() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(today);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const yesterdayEnd = new Date(today);

    // Find sum grouped by agent_id
    const rows = await Transaction.findAll({
      where: {
        createdAt: {
          [Op.gte]: yesterdayStart,
          [Op.lt]: yesterdayEnd,
        },
      },
      attributes: [
        "agent_id",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: ["agent_id"],
      order: [[sequelize.literal("totalAmount"), "DESC"]],
      limit: 1,
      include: [
        {
          model: Agent,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "phone"],
            },
          ],
        },
      ],
    });

    if (rows.length === 0) {
      return { message: "No transactions yesterday", agent: null };
    }

    return rows[0];
  } catch (error) {
    throw new Error("Failed to fetch top agent: " + error.message);
  }
}
