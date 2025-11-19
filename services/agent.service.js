// services/agent.service.js
import bcrypt from "bcrypt";
import { Agent, User } from "../models/index.js";

export async function createAgent(data) {
  const {
    agentId,
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
  } = data;

  const existing = await User.findOne({ where: { phone } });
  if (existing) throw new Error("Phone already exists");

  const existingAgent = await Agent.findByPk(agentId);
  if (existingAgent) throw new Error("Agent already exists with ID");

  // create user
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    role: "AGENT",
  });

  // create agent profile
  const agent = await Agent.create({
    id: agentId,
    user_id: user.id,
    dob,
    aadhaarNumber,
    aadhaarImage,
    panNo,
    panImage,
    address,
  });

  return { user, agent };
}

export async function getAllAgents() {
  return Agent.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "phone", "role"],
      },
    ],
  });
}

export async function getAgentById(id) {
  const agent = await Agent.findByPk(id, {
    include: [{ model: User }],
  });

  if (!agent) throw new Error("Agent not found");
  return agent;
}

export async function getAgentByUserId(userId) {
  const agent = await Agent.findOne({
    where: { user_id: userId },
    include: [{ model: User }],
  });

  if (!agent) throw new Error("Agent not found");
  return agent;
}

export async function updateAgent(id, data) {
  const agent = await Agent.findByPk(id);
  if (!agent) throw new Error("Agent not found");

  await agent.update(data);
  return agent;
}

export async function deleteAgent(id) {
  const agent = await Agent.findByPk(id);
  if (!agent) throw new Error("Agent not found");

  const user = await User.findByPk(agent.user_id);

  await agent.destroy();
  await user.destroy();

  return { message: "Agent deleted" };
}

export async function getAgentByQuery(searchQuery) {
  try {
    const agents = await Agent.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email", "phone", "role"],
          where: {
            [Op.or]: [
              { firstName: { [Op.like]: `%${searchQuery}%` } },
              { lastName: { [Op.like]: `%${searchQuery}%` } },
              { phone: { [Op.like]: `%${searchQuery}%` } },
            ],
          },
        },
      ],
      order: [["id", "ASC"]],
    });
    return agents;
  } catch (err) {
    throw new Error("Failed to fetch agents: " + err.message);
  }
}
