require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const sensorRoutes = require("./routes/sensor");

const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST"],
}));
app.use(express.json());

app.use("/api/sensor", sensorRoutes);

app.get("/", (req, res) => res.json({ status: "IoT-AI Food Preservation API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  try {
    await axios.get(`${process.env.ML_SERVICE_URL}/health`);
    console.log("ML service: online");
  } catch {
    console.warn("ML service: OFFLINE - start ml/app.py or predictions will fail");
  }
});
