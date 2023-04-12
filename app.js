const express = require("express"); // getting express from node

const app = express();

const PORT = 4029;

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

const routes = require("./controllers/routes");
app.use("/", routes);
