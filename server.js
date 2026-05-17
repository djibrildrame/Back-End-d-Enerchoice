const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const candidatureRoute = require("./routes/CandidatureRoute");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/candidature", candidatureRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch((error) => console.log(error));

app.listen(8000, () => {
  console.log("Serveur lancé sur le port 8000");
});