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
import https from "https";

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
  const PORT = process.env.PORT || 3000;
  // Server Initialization
  if (process.env.DEPLOY_ENV === "local") {
    await testConnection();

    await sequelize.sync();
    console.log("✔ All models synchronized");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } else if (process.env.DEPLOY_ENV === "prod") {
    try {
      await testConnection();

      await sequelize.sync();
      console.log("✔ All models synchronized");
      const options = {
        cert: fs.readFileSync(process.env.SSL_CRT_PATH),
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
      };
      const httpsServer = https.createServer(options, app);
      httpsServer.listen(PORT, () => {
        console.log(`HTTPS Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start HTTPS server:", error.message);
    }
  }
}

startServer();
