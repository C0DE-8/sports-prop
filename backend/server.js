require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const propsRouter = require("./router/props.router");
const systemRouter = require("./router/system.router");

const app = express();
const port = Number(process.env.PORT || 5050);

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "sports-prop-backend",
    endpoints: ["/health", "/api/debug", "/api/props", "/api/props/:id", "/api/leagues"]
  });
});

app.use("/", systemRouter);
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
