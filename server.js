// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

import { testConnection } from "./config/dbConnection.js";
import { sequelize } from "./models/index.js";
import appRoutes from "./routes/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // FIXED — CommonJS default import
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});

app.use("/api", appRoutes);

// Start server only after DB connection
async function startServer() {
  await testConnection();

  // Sync all models (creates tables if needed)
  await sequelize.sync({ alter: true });
  console.log("✔ All models synchronized");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
