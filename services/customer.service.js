import bcrypt from "bcrypt";
import { Customer, User, Agent } from "../models/index.js";

export async function createCustomer(data) {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    dob,
    aadhaarNumber,
    aadhaarImage,
    panNo,
    panImage,
    address,
    agent_id,
  } = data;

  const existing = await User.findOne({ where: { phone } });
  if (existing) throw new Error("Phone already registered");

  const existingAgent = await Agent.findByPk(agent_id);
  if (!existingAgent) throw new Error("Agent ID is invalid");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    role: "CUSTOMER",
  });

  const customer = await Customer.create({
    user_id: user.id,
    agent_id,
    dob,
    aadhaarNumber,
    aadhaarImage,
    panNo,
    panImage,
    address,
  });

  return { user, customer };
}

export async function getAllCustomers() {
  return Customer.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "phone", "role"],
      },
      {
        model: Agent,
        required: false,
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

export async function getCustomerById(id) {
  const customer = await Customer.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "phone", "role"],
      },
      {
        model: Agent,
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "phone"],
          },
        ],
      },
    ],
  });

  if (!customer) throw new Error("Customer not found");
  return customer;
}

export async function getCustomerByUserId(userId) {
  const customer = await Customer.findOne({
    where: { user_id: userId },
    include: [
      { model: User },
      {
        model: Agent,
        include: [{ model: User }],
      },
    ],
  });

  if (!customer) throw new Error("Customer not found");
  return customer;
}

export async function updateCustomer(id, data) {
  const customer = await Customer.findByPk(id);
  if (!customer) throw new Error("Customer not found");

  await customer.update(data);

  return getCustomerById(id);
}

export async function deleteCustomer(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) throw new Error("Customer not found");

  const user = await User.findByPk(customer.user_id);

  await customer.destroy();
  await user.destroy();

  return { message: "Customer deleted successfully" };
}
