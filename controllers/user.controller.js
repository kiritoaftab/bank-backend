import {
  createUser,
  deleteUser,
  getAllStaff,
  getAllUsers,
  getUserById,
  getUserByName,
  updateUser,
} from "../services/user.service.js";

export async function create(req, res) {
  try {
    const result = await createUser(req.body);
    res.json({ message: "User created successfully", data: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getStaffAll(req, res) {
  try {
    const users = await getAllStaff();
    res.json({ users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const user = await getUserById(req.params.id);
    res.json({ user });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const response = await deleteUser(req.params.id);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getByName(req, res) {
  try {
    const { searchQuery } = req.query;
    const users = await getUserByName(searchQuery);
    res.json({ users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
