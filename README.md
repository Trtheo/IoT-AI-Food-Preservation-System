# FreshGuard — IoT-AI Food Preservation System

A full-stack IoT system that monitors fruit storage conditions in real time and predicts spoilage using a machine learning model. Supports **Banana** and **Tomato** with fruit-specific thresholds, biological spoilage ranges, and chilling injury detection.

## Architecture

```
ESP32 / Simulator  →  Firebase Realtime DB  →  Node.js Backend  →  React Frontend
                                                      ↕
                                               Python ML Service
```

| Layer | Stack | Port |
|-------|-------|------|
| Frontend | React 19 + Vite + Tailwind CSS | 5173 |
| Backend | Node.js + Express | 5000 |
| ML Service | Python + Flask + Random Forest | 5001 |
| Database | Firebase Realtime Database | — |
| Simulator | Python (replaces real ESP32) | — |

---

## Prerequisites

- Node.js ≥ 18
- Python ≥ 3.9
- A Firebase project with Realtime Database enabled

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → your project → **Project Settings** → **Service Accounts**
2. Click **Generate new private key** and download the JSON file
3. Replace `backend/serviceAccountKey.json` with the downloaded file
4. Confirm `backend/.env` matches your project:

```env
PORT=5000
FIREBASE_DATABASE_URL=https://<your-project-id>-default-rtdb.firebaseio.com
ML_SERVICE_URL=http://localhost:5001
ALLOWED_ORIGIN=http://localhost:5173
```

---

## Running the Project

Open **4 terminals** and run each service in order.

### Terminal 1 — ML Service

```bash
cd ml
pip install -r requirements.txt
python train.py        # run once — generates model.pkl and label_encoder.pkl
python app.py          # starts ML service on http://localhost:5001
```

> To enable debug mode: `set FLASK_DEBUG=true && python app.py` (Windows)

### Terminal 2 — Backend

```bash
cd backend
npm install
npm run dev            # starts API on http://localhost:5000
```

### Terminal 3 — Frontend

```bash
cd frontend
npm install
npm run dev            # starts dashboard on http://localhost:5173
```

### Terminal 4 — Simulator (replaces a real ESP32)

```bash
cd simulator
pip install -r requirements.txt
python simulate.py     # prompts for fruit selection, then pushes data every 5s
```

> The simulator prompts you to choose **Banana** or **Tomato** at startup.  
> It auto-progresses through Fresh → Ripening → Spoiling over time.  
> Storage time is persisted in `simulator/simulator_state.txt` — restarts resume from where they left off.  
> Skip this terminal if you have a real ESP32 sending data.

---

## API Endpoints

All endpoints are served from `http://localhost:5000`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sensor/latest` | Latest sensor reading with staleness flag |
| GET | `/api/sensor/history?limit=50` | Historical readings (default 50) |
| GET | `/api/sensor/alerts?limit=100` | Alert history (default 100, newest first) |
| GET | `/api/sensor/prediction` | ML prediction from latest live reading |
| POST | `/api/sensor/predict` | ML prediction from manually supplied values |

### POST `/api/sensor/predict` — Request Body

```json
{
  "fruit_type": "banana",
  "temperature": 14.5,
  "humidity": 88,
  "gas": 130,
  "storage_time": 24,
  "temp_delta": 6.0
}
```

### Alert Thresholds (per fruit)

| Sensor | Banana | Tomato |
|--------|--------|--------|
| Temperature | < 13 °C or > 19 °C | < 10 °C (chilling) or > 20 °C |
| Humidity | > 95 % | > 93 % |
| Gas | > 220 ppm | > 220 ppm |

> Tomato stored below 10 °C triggers a chilling injury alert even if gas levels look normal.

### Prediction Response Example

```json
{
  "fruit_type": "banana",
  "condition": "Fresh",
  "risk_level": "Low",
  "shelf_life": "4-6 days",
  "confidence": 96.3,
  "probabilities": {
    "Fresh": 96.3,
    "Ripening": 2.8,
    "Spoiling": 0.9
  }
}
```

### Latest Reading Response (with staleness)

```json
{
  "fruit_type": "banana",
  "temperature": 14.5,
  "humidity": 88.0,
  "gas": 130,
  "storage_time": 24.0,
  "external_temperature": 20.5,
  "temp_delta": 6.0,
  "timestamp": 1700000000000,
  "stale": false,
  "last_seen_seconds": 3
}
```

> `stale` is `true` if the last reading is older than 30 seconds. The frontend shows a sensor-offline banner in this case.

---

## Firebase Data Structure

```json
{
  "sensor_data": {
    "<push_id>": {
      "fruit_type": "banana",
      "temperature": 14.5,
      "humidity": 88.0,
      "gas": 130,
      "storage_time": 24.0,
      "external_temperature": 20.5,
      "temp_delta": 6.0,
      "timestamp": 1700000000000
    }
  }
}
```

---

## Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Live sensor readings, fruit badge, sensor online/offline status |
| `/graphs` | Historical charts for temperature, humidity, gas, and temp delta — per-fruit thresholds |
| `/prediction` | Live ML prediction + manual prediction form (switch via Live/Manual toggle) |
| `/alerts` | Alert history with fruit filter, limit selector, and pagination |

### Fruit Selector
A **Banana / Tomato toggle** in the navbar updates thresholds, chart ranges, and prediction defaults across all pages instantly — no page reload needed.

### Sensor Status
The Home page shows a live/offline badge:
- Green — sensor is live, shows seconds since last reading
- Orange — sensor offline, shows how long ago the last reading was received

### Manual Prediction Form
On the `/prediction` page, switch to **Manual** mode to enter sensor values directly and get an instant ML prediction — useful when the sensor is offline or for supervisor demos.

> All pages fall back to demo data automatically if the backend is unreachable.

---

## ML Model

- Algorithm: Random Forest Classifier (100 trees)
- Features: `fruit_type`, `temperature`, `humidity`, `gas`, `storage_time`, `temp_delta`
- Classes: `Fresh`, `Ripening`, `Spoiling`
- Training samples: 1100 synthetic samples (500 banana + 500 tomato + 100 tomato chilling injury)
- Artifacts: `ml/model.pkl`, `ml/label_encoder.pkl` (produced by `train.py`)

### Fruit-Specific Training Ranges

| Condition | Banana Temp | Tomato Temp | Gas |
|-----------|-------------|-------------|-----|
| Fresh | 13–15 °C | 10–15 °C | 80–150 ppm |
| Ripening | 15–19 °C | 15–20 °C | 150–220 ppm |
| Spoiling | 19–30 °C | 20–30 °C | 220–400 ppm |
| Chilling (tomato only) | — | 2–9.9 °C | 80–180 ppm → Spoiling |

> The chilling injury class teaches the model that tomato at low temperature is Spoiling even when gas levels appear normal — a biologically critical edge case.

### Shelf Life Estimates (per fruit)

| Condition | Banana | Tomato |
|-----------|--------|--------|
| Fresh | 4–6 days | 5–7 days |
| Ripening | 1–2 days | 2–3 days |
| Spoiling | < 12 hours | < 24 hours |

---

## Simulator Scenarios

| Scenario | Banana Duration | Tomato Duration |
|----------|----------------|----------------|
| Fresh | 48 hrs | 72 hrs |
| Ripening | 24 hrs | 48 hrs |
| Spoiling | indefinite | indefinite |

Storage time is saved to `simulator/simulator_state.txt` on every push and restored on restart, so the simulation continues from the correct point in the fruit's lifecycle.
