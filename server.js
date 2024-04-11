import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dbConnection } from "./src/db/db-connection.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hola, server funcionando");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server up on port ${PORT}`);
  });
});
