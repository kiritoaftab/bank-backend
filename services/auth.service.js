import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export async function registerUser(data) {
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

export async function loginUser(phone, password) {
  const user = await User.findOne({ where: { phone } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { user, token };
}
