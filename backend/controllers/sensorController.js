const db = require("../config/firebase");
const axios = require("axios");
require("dotenv").config();

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

function getAlertMessages(r, fruit) {
  const t = THRESHOLDS[fruit] || THRESHOLDS[DEFAULT_FRUIT];
  const msgs = [];

  if (t.temperature.min !== undefined && r.temperature < t.temperature.min)
    msgs.push(`Low temperature (chilling risk): ${r.temperature}°C — min is ${t.temperature.min}°C`);
  if (r.temperature > t.temperature.max)
    msgs.push(`High temperature: ${r.temperature}°C — max is ${t.temperature.max}°C`);
  if (t.humidity.min !== undefined && r.humidity < t.humidity.min)
    msgs.push(`Low humidity: ${r.humidity}% — min is ${t.humidity.min}%`);
  if (r.humidity > t.humidity.max)
    msgs.push(`High humidity: ${r.humidity}% — max is ${t.humidity.max}%`);
  if (r.gas > t.gas.max)
    msgs.push(`High gas level: ${r.gas} ppm — max is ${t.gas.max} ppm`);

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
    const { limit = 50 } = req.query;
    const snapshot = await db
      .ref("sensor_data")
      .limitToLast(Number(limit))
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
    const { limit = 100 } = req.query;
    const snapshot = await db
      .ref("sensor_data")
      .limitToLast(Number(limit))
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

    const mlRes = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      {
        fruit_type:   fruit,
        temperature:  latest.temperature,
        humidity:     latest.humidity,
        gas:          latest.gas,
        storage_time: latest.storage_time || 0,
        temp_delta:   temp_delta,
      }
    );
    res.json(mlRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getManualPrediction = async (req, res) => {
  try {
    const { fruit_type, temperature, humidity, gas, storage_time, temp_delta } = req.body;
    const mlRes = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, {
      fruit_type,
      temperature,
      humidity,
      gas,
      storage_time,
      temp_delta: temp_delta ?? 0,
    });
    res.json(mlRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLatest, getHistory, getAlerts, getPrediction, getManualPrediction };
