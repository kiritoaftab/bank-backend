import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
  }
);

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✔ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to DB:", error);
  }
}
