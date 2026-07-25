require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const authRouter = require("./router/auth.router");
const matchesRouter = require("./router/matches.router");
const propsRouter = require("./router/props.router");
const systemRouter = require("./router/system.router");
const usersRouter = require("./router/users.router");

const app = express();
const port = Number(process.env.PORT || 5050);

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "sports-prop-backend",
    endpoints: [
      "/health",
      "/api/health",
      "/api/debug",
      "/api/auth/register",
      "/api/auth/login",
      "/api/users/me",
      "/api/matches",
      "/api/props",
      "/api/props/:id",
      "/api/leagues"
    ]
  });
});

app.use("/", systemRouter);
app.use("/api", systemRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api", matchesRouter);
app.use("/api", propsRouter);

const server = app.listen(port, () => {
  console.log(`Sports prop backend listening on http://localhost:${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Set PORT to another value.`);
    process.exit(1);
  }

  throw error;
});
