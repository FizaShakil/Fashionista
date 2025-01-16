import express from "express";

const app = express();

// Middleware and routes
app.use(express.json());

export default app;
