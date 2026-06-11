require("dotenv").config();
const db = require("../config/firebase");
const axios = require("axios");

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

// Per-fruit thresholds: upper AND lower bounds
const THRESHOLDS = {
  banana: {
    temperature: { min: 13,  max: 19  },
    humidity:    { min: 80,  max: 95  },
    gas:         {           max: 220 },
  },
  tomato: {
    temperature: { min: 10,  max: 20  },  // below 10 = chilling injury
    humidity:    { min: 80,  max: 93  },
    gas:         {           max: 220 },
  },
};

const DEFAULT_FRUIT = "banana";
const STALE_THRESHOLD_MS = 30000; // 30 seconds

function calcHeatLoad(temp_delta, storage_time) {
  return Math.round(temp_delta * storage_time * 100) / 100;
}

// Fourier's Law of Conduction: Q = k_wall * |temp_delta|
const K_WALL = { banana: 0.12, tomato: 0.10 };
function calcConduction(fruit, temp_delta) {
  return Math.round(K_WALL[fruit] * Math.abs(temp_delta) * 1000) / 1000;
}

// COP = Q_cold / W_input  (Q_cold = cooling_rate * storage_time)
function calcCOP(cooling_rate, storage_time, conduction) {
  const q_cold = (cooling_rate ?? 0) * (storage_time ?? 0);
  return Math.round(q_cold / (conduction + 0.001) * 100) / 100;
}

// Heat-based thresholds — temperature is an indicator of heat level
const HEAT_THRESHOLDS = {
  banana: { heat_load: 300, conduction: 0.6, cop_min: 1.0, temp_min: 13, temp_max: 19, hum_max: 95, gas_max: 220 },
  tomato: { heat_load: 250, conduction: 0.5, cop_min: 1.0, temp_min: 10, temp_max: 20, hum_max: 93, gas_max: 220 },
};

function getAlertMessages(r, fruit) {
  const t = HEAT_THRESHOLDS[fruit] || HEAT_THRESHOLDS[DEFAULT_FRUIT];
  const msgs = [];

  const heat_load  = r.heat_load  ?? calcHeatLoad(r.temp_delta ?? 0, r.storage_time ?? 0);
  const conduction = r.conduction ?? calcConduction(fruit, r.temp_delta ?? 0);
  const cop        = r.cop        ?? calcCOP(r.cooling_rate, r.storage_time, conduction);

  // --- Heat is the primary cause ---
  if (heat_load > t.heat_load)
    msgs.push(`Excess heat absorbed: ${heat_load} kJ/kg — fruit thermal damage threshold exceeded (max ${t.heat_load} kJ/kg)`);

  if (conduction > t.conduction)
    msgs.push(`Heat leaking into storage: ${conduction} W/m²K — external heat conducting through walls (max ${t.conduction} W/m²K)`);

  if (cop < t.cop_min)
    msgs.push(`Cooling system losing heat battle: COP ${cop} — heat removal rate insufficient (min COP ${t.cop_min})`);

  // --- Temperature is a symptom of heat accumulation ---
  if (fruit === "tomato" && r.temperature < 10)
    msgs.push(`Chilling injury: heat removed too aggressively — tomato at ${r.temperature}°C causes cell damage`);
  else if (r.temperature < t.temp_min)
    msgs.push(`Insufficient heat in storage: ${r.temperature}°C below safe range — risk of chilling damage (min ${t.temp_min}°C)`);
  else if (r.temperature > t.temp_max)
    msgs.push(`Excess heat in storage: ${r.temperature}°C — heat accumulation accelerating spoilage (max ${t.temp_max}°C)`);

  if (r.humidity > t.hum_max)
    msgs.push(`High humidity: ${r.humidity}% — moisture amplifies heat damage on fruit surface (max ${t.hum_max}%)`);

  if (r.gas > t.gas_max)
    msgs.push(`Elevated gas: ${r.gas} ppm — heat-driven metabolic activity producing excess ethylene (max ${t.gas_max} ppm)`);

  return msgs;
}

const getLatest = async (req, res) => {
  try {
    const snapshot = await db.ref("sensor_data").limitToLast(1).once("value");
    const data = snapshot.val();
    if (!data) return res.status(404).json({ message: "No data found" });

    const latest = Object.values(data)[0];
    const ageMs  = Date.now() - latest.timestamp;
    const stale  = ageMs > STALE_THRESHOLD_MS;

    res.json({
      ...latest,
      stale,
      last_seen_seconds: Math.floor(ageMs / 1000),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit ?? 50, 10);
    if (isNaN(limit) || limit < 1) return res.status(400).json({ error: "limit must be a positive integer" });
    const snapshot = await db
      .ref("sensor_data")
      .limitToLast(limit)
      .once("value");
    const data = snapshot.val();
    if (!data) return res.status(404).json({ message: "No data found" });
    const records = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAlerts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit ?? 100, 10);
    if (isNaN(limit) || limit < 1) return res.status(400).json({ error: "limit must be a positive integer" });
    const snapshot = await db
      .ref("sensor_data")
      .limitToLast(limit)
      .once("value");
    const data = snapshot.val();
    if (!data) return res.json([]);

    const alerts = Object.values(data)
      .map((r) => {
        const fruit = r.fruit_type || DEFAULT_FRUIT;
        const messages = getAlertMessages(r, fruit);
        return messages.length > 0
          ? { timestamp: r.timestamp, fruit_type: fruit, messages }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp);

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPrediction = async (req, res) => {
  try {
    const snapshot = await db.ref("sensor_data").limitToLast(1).once("value");
    const data = snapshot.val();
    if (!data) return res.status(404).json({ message: "No data found" });

    const latest = Object.values(data)[0];
    // Allow frontend to override fruit_type via query param
    const fruit  = req.query.fruit_type || latest.fruit_type || DEFAULT_FRUIT;
    const temp_delta = latest.temp_delta !== undefined
      ? latest.temp_delta
      : (latest.external_temperature || latest.temperature) - latest.temperature;
    const heat_load = latest.heat_load ?? calcHeatLoad(temp_delta, latest.storage_time || 0);

    const mlRes = await axios.post(
      `${ML_URL}/predict`,
      {
        fruit_type:   fruit,
        temperature:  latest.temperature,
        humidity:     latest.humidity,
        gas:          latest.gas,
        storage_time: latest.storage_time || 0,
        temp_delta,
        heat_load,
      }
    );
    res.json(mlRes.data);
  } catch (err) {
    const msg = err.code === "ECONNREFUSED"
      ? `ML service unreachable at ${ML_URL} — is it running?`
      : err.response?.data?.error || err.message;
    res.status(500).json({ error: msg });
  }
};

const getManualPrediction = async (req, res) => {
  try {
    const { fruit_type, temperature, humidity, gas, storage_time, temp_delta } = req.body;
    const missing = ["fruit_type", "temperature", "humidity", "gas", "storage_time", "temp_delta"]
      .filter((f) => req.body[f] === undefined || req.body[f] === null);
    if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
    const heat_load = req.body.heat_load ?? calcHeatLoad(temp_delta ?? 0, storage_time ?? 0);
    const mlRes = await axios.post(`${ML_URL}/predict`, {
      fruit_type, temperature, humidity, gas, storage_time,
      temp_delta: temp_delta ?? 0,
      heat_load,
    });
    res.json(mlRes.data);
  } catch (err) {
    const msg = err.code === "ECONNREFUSED"
      ? `ML service unreachable at ${ML_URL} — is it running?`
      : err.response?.data?.error || err.message;
    res.status(500).json({ error: msg });
  }
};

const getFeatureImportance = async (req, res) => {
  try {
    const mlRes = await axios.get(`${ML_URL}/features`);
    res.json(mlRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLatest, getHistory, getAlerts, getPrediction, getManualPrediction, getFeatureImportance };
