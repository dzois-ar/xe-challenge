/**
 * Express app wiring:
 * - CORS restricted to Vite dev server origin (5173)
 * - JSON body parsing
 * - Routes under /api
 * - Global 404 + error handler
 */
const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Simple healthcheck endpoint (useful for Docker/CI)
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

