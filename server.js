// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

import { testConnection, sequelize } from "./config/dbConnection.js";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // FIXED — CommonJS default import
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});

// Start server only after DB connection
async function startServer() {
  await testConnection();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
