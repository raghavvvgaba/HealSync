const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/", (req, res) => {
    res.send("Hello, World!");
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
