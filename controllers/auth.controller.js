// controllers/auth.controller.js
import { registerUser, loginUser } from "../services/auth.service.js";

export async function register(req, res) {
  try {
    const user = await registerUser(req.body);
    res.json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { phone, password } = req.body;
  console.log(phone, password);

  try {
    const { user, token } = await loginUser(phone, password);

    res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
