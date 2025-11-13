import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

import UserModel from "./user.model.js";
import AgentModel from "./agent.model.js";
import CustomerModel from "./customer.model.js";
import AccountModel from "./account.model.js";
import LoanModel from "./loan.model.js";
import TransactionModel from "./transaction.model.js";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

export const User = UserModel(sequelize, DataTypes);
export const Agent = AgentModel(sequelize, DataTypes);
export const Customer = CustomerModel(sequelize, DataTypes);
export const Account = AccountModel(sequelize, DataTypes);
export const Loan = LoanModel(sequelize, DataTypes);
export const Transaction = TransactionModel(sequelize, DataTypes);

User.hasOne(Agent, { foreignKey: "user_id" });
Agent.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Customer, { foreignKey: "user_id" });
Customer.belongsTo(User, { foreignKey: "user_id" });

Agent.hasMany(Customer, { foreignKey: "agent_id" });
Customer.belongsTo(Agent, { foreignKey: "agent_id" });

Customer.hasMany(Account, { foreignKey: "customer_id" });
Account.belongsTo(Customer, { foreignKey: "customer_id" });

Customer.hasMany(Loan, { foreignKey: "customer_id" });
Loan.belongsTo(Customer, { foreignKey: "customer_id" });

Customer.hasMany(Transaction, { foreignKey: "customer_id" });
Transaction.belongsTo(Customer, { foreignKey: "customer_id" });

Account.hasMany(Transaction, { foreignKey: "account_id" });
Transaction.belongsTo(Account, { foreignKey: "account_id" });

Loan.hasMany(Transaction, { foreignKey: "loan_id" });
Transaction.belongsTo(Loan, { foreignKey: "loan_id" });

Agent.hasMany(Transaction, { foreignKey: "agent_id" });
Transaction.belongsTo(Agent, { foreignKey: "agent_id" });

export default {
  sequelize,
  User,
  Agent,
  Customer,
  Account,
  Loan,
  Transaction,
};
