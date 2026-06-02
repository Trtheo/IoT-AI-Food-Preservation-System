const express = require("express");
const router = express.Router();
const { getLatest, getHistory, getAlerts, getPrediction, getManualPrediction, getFeatureImportance } = require("../controllers/sensorController");

router.get("/latest", getLatest);
router.get("/history", getHistory);
router.get("/alerts", getAlerts);
router.get("/prediction", getPrediction);
router.post("/predict", getManualPrediction);
router.get("/features", getFeatureImportance);

module.exports = router;
