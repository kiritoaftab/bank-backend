import { sequelize } from "../models/index.js";
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✔ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to DB:", error);
  }
}
