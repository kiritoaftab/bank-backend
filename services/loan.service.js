import { Loan, Customer, User } from "../models/index.js";

export async function createLoan(data) {
  const {
    accountNumber,
    accountCode,
    loanAmount,
    pendingDue = 0,
    prevDue = 0,
    customer_id,
  } = data;

  const customer = await Customer.findByPk(customer_id);
  if (!customer) throw new Error("Customer not found");

  const existing = await Loan.findOne({ where: { accountNumber } });
  if (existing) throw new Error("Loan with this accountNumber already exists");

  const loan = await Loan.create({
    accountNumber,
    accountCode,
    loanAmount,
    pendingDue,
    prevDue,
    customer_id,
  });

  return loan;
}

export async function getAllLoans() {
  return Loan.findAll({
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

export async function getLoanById(id) {
  const loan = await Loan.findByPk(id, {
    include: [
      {
        model: Customer,
        include: [{ model: User }],
      },
    ],
  });

  if (!loan) throw new Error("Loan not found");
  return loan;
}

export async function getLoansByCustomer(customer_id) {
  const loans = await Loan.findAll({
    where: { customer_id },
    include: [
      {
        model: Customer,
        include: [{ model: User }],
      },
    ],
  });

  return loans;
}

export async function updateLoan(id, data) {
  const loan = await Loan.findByPk(id);
  if (!loan) throw new Error("Loan not found");

  await loan.update(data);

  return getLoanById(id);
}

export async function deleteLoan(id) {
  const loan = await Loan.findByPk(id);
  if (!loan) throw new Error("Loan not found");

  await loan.destroy();

  return { message: "Loan deleted successfully" };
}
