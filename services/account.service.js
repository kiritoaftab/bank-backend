import { Account, Customer, User } from "../models/index.js";

export async function createAccount(data) {
  const {
    accountNumber,
    accountCode,
    customer_id,
    accountType,
    balance = 0,
    prevBalance = 0,
  } = data;

  const customer = await Customer.findByPk(customer_id);
  if (!customer) throw new Error("Customer not found");

  const existing = await Account.findOne({ where: { accountNumber } });
  if (existing) throw new Error("Account number already exists");

  const account = await Account.create({
    accountNumber,
    accountCode,
    customer_id,
    accountType,
    balance,
    prevBalance,
  });

  return account;
}

export async function getAllAccounts() {
  return Account.findAll({
    include: [
      {
        model: Customer,
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "phone"],
          },
        ],
      },
    ],
    order: [["id", "ASC"]],
  });
}

export async function getAccountById(id) {
  const account = await Account.findByPk(id, {
    include: [
      {
        model: Customer,
        include: [{ model: User }],
      },
    ],
  });

  if (!account) throw new Error("Account not found");
  return account;
}

export async function getAccountsByCustomer(customerId) {
  const accounts = await Account.findAll({
    where: { customer_id: customerId },
    include: [{ model: Customer, include: [{ model: User }] }],
  });
  return accounts;
}

export async function updateAccount(id, data) {
  const account = await Account.findByPk(id);
  if (!account) throw new Error("Account not found");

  await account.update(data);
  return getAccountById(id);
}

export async function deleteAccount(id) {
  const account = await Account.findByPk(id);
  if (!account) throw new Error("Account not found");

  await account.destroy();
  return { message: "Account deleted successfully" };
}
