import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { Op } from "sequelize";

export async function createUser(data) {
  const { firstName, lastName, email, phone, password, role } = data;

  const existing = await User.findOne({ where: { phone } });
  if (existing) throw new Error("Phone number already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    role: role || "CUSTOMER",
  });

  return user;
}

export async function getAllUsers() {
  return User.findAll({
    attributes: {
      exclude: ["password"],
    },
    order: [["id", "ASC"]],
  });
}

export async function getAllStaff() {
  return User.findAll({
    where: {
      role: ["ADMIN", "MANAGER", "STAFF", "AGENT"], // IN clause
    },
    attributes: {
      exclude: ["password"],
    },
    order: [["id", "ASC"]],
  });
}

export async function getUserById(id) {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) throw new Error("User not found");
  return user;
}

export async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await user.update(data);

  const safeUser = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  return safeUser;
}

export async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  await user.destroy();
  return { message: "User deleted successfully" };
}

export async function getUserByName(searchQuery) {
  try {
    const users = await User.findAll({
      where: {
        role: { [Op.ne]: "CUSTOMER" },
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchQuery}%` } },
          { lastName: { [Op.like]: `%${searchQuery}%` } },
          { phone: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
      order: [["firstName", "ASC"]],
    });

    return users;
  } catch (err) {
    throw new Error("Failed to fetch users: " + err.message);
  }
}
