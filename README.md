# FreshGuard — IoT-AI Food Preservation System

A full-stack IoT system that monitors fruit storage conditions in real time and predicts spoilage using machine learning. Built around **heat as the primary cause of spoilage** — temperature, gas, and humidity are treated as symptoms of heat accumulation. Supports **Banana** and **Tomato** with fruit-specific biological thresholds, chilling injury detection, and physics-based heat metrics derived from Newton's Law of Cooling, Fourier's Law of Conduction, and the Coefficient of Performance (COP).

---

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
| Hardware | ESP32 + DHT22 + MQ2 + Dual OLED (Wokwi) | — |
| Simulator | Python (replaces real ESP32) | — |

---

## Physics Laws Applied

### 1. Newton's Law of Cooling
Models the rate at which stored fruit temperature changes toward the external environment:
```
dT/dt = -k(T_storage - T_external)
```
Used to compute `cooling_rate` and `time_to_safe` — estimated hours to bring fruit back to safe storage temperature.

| Fruit | k (cooling constant) | Safe Target Temp |
|-------|---------------------|-----------------|
| Banana | 0.05 | 14 °C |
| Tomato | 0.04 | 12 °C |

### 2. Fourier's Law of Conduction
Models heat leaking INTO storage through the walls from the external environment:
```
Q_cond = k_wall × |T_external - T_storage|
```
Higher conduction means the storage walls are failing to insulate the fruit from external heat.

| Fruit | k_wall | Alert Threshold |
|-------|--------|----------------|
| Banana | 0.12 W/m·K | > 0.6 W/m²K |
| Tomato | 0.10 W/m·K | > 0.5 W/m²K |

### 3. Heat Load Accumulation
Total thermal energy absorbed by the fruit over time:
```
heat_load = temp_delta × storage_time
```
Even if current temperature looks acceptable, a high heat load means the fruit has already accumulated damaging thermal energy.

| Fruit | Alert Threshold |
|-------|----------------|
| Banana | > 300 kJ/kg |
| Tomato | > 250 kJ/kg |

### 4. Coefficient of Performance (COP)
Measures how efficiently the cooling system removes heat relative to heat leaking in:
```
COP = Q_cold / W_input = (cooling_rate × storage_time) / conduction
```

| COP Value | Meaning | Card Color |
|-----------|---------|-----------|
| ≥ 3.0 | Cooling system efficient | Green |
| 1.0 – 3.0 | Marginal efficiency | Yellow |
| < 1.0 | Cooling losing heat battle | Red |

### 5. MQ2 Gas Sensor — Voltage-to-PPM Conversion
Linear approximation of ethylene/spoilage gas concentration:
```
voltage = adc_val × (3.3 / 4095)
ppm     = 80 + (voltage / 3.3) × 320   [clamped: 80–400 ppm]
```

### 6. Chilling Injury (Biological Law)
Tomato stored below **10 °C** suffers irreversible cell membrane damage even when gas levels appear normal. This triggers a dedicated `Too Cold!` alert and is modelled as a separate Spoiling class in the ML model.

---

## Fruit Thresholds

These are the exact values used in the ESP32 firmware, backend, and frontend.

### Banana

| Metric | Safe Range | Alert Threshold | Status Message |
|--------|-----------|-----------------|----------------|
| Temperature | 13 °C – 19 °C | < 13 or > 19 | `Too Cold!` / `Too Hot!` |
| Humidity | — | > 95 % | `Too Humid!` |
| Gas | — | > 220 ppm | `Going Bad!` |
| Heat Load | — | > 300 kJ/kg | `Too Hot!` |
| Conduction | — | > 0.6 W/m²K | `Walls Hot!` |
| COP | — | < 1.0 | `Cooling Fail` |

### Tomato

| Metric | Safe Range | Alert Threshold | Status Message |
|--------|-----------|-----------------|----------------|
| Temperature | 10 °C – 20 °C | < 10 (chilling injury) | `Too Cold!` |
| Temperature | 10 °C – 20 °C | > 20 | `Too Hot!` |
| Humidity | — | > 93 % | `Too Humid!` |
| Gas | — | > 220 ppm | `Going Bad!` |
| Heat Load | — | > 250 kJ/kg | `Too Hot!` |
| Conduction | — | > 0.5 W/m²K | `Walls Hot!` |
| COP | — | < 1.0 | `Cooling Fail` |

---

## Heat-First Alert Logic

**Heat is the primary cause of spoilage. Temperature is a symptom.**

Alert priority order (both fruits):
1. `heat_load` exceeded — fruit has absorbed too much thermal energy → `Too Hot!`
2. `conduction` exceeded — external heat leaking through storage walls → `Walls Hot!`
3. `COP < 1.0` — cooling system losing the heat battle → `Cooling Fail`
4. Temperature out of range — symptom of heat imbalance → `Too Cold!` / `Too Hot!`
5. Humidity too high — moisture amplifying heat damage → `Too Humid!`
6. Gas too high — heat-driven ethylene production → `Going Bad!`
7. All conditions met → `All Good`

---

## Wokwi Hardware Guidance

### Components
| Component | Pin | Purpose |
|-----------|-----|---------|
| DHT22 | GPIO 4 | Temperature + Humidity |
| MQ2 Potentiometer | GPIO 34 | Gas level (80–400 ppm) |
| Heat Potentiometer | GPIO 35 | External temperature (20–45 °C) |
| OLED 1 (SSD1306 0x3C) | SCL=GPIO23, SDA=GPIO22 | Live current readings |
| OLED 2 (SSD1306 0x3D) | SCL=GPIO23, SDA=GPIO22 | Previous readings (rolling) |
| Red LED | GPIO 14 | Alert indicator |
| Green LED | GPIO 27 | Safe indicator |
| Buzzer | GPIO 18 | Audio alert |
| Button | GPIO 25 | Fruit toggle / alert acknowledge |

### Potentiometer Mapping
| Potentiometer | GPIO | Maps To | Range |
|---|---|---|---|
| MQ2 AOUT | 34 | Gas ppm | 80 – 400 ppm |
| Heat Pot | 35 | External Temperature | 20 – 45 °C |

DHT22 temperature and humidity are set directly in the Wokwi component attributes panel.

---

## Wokwi Safe Condition Examples

### Banana — Safe (`All Good`)

| Setting | Where | Value |
|---------|-------|-------|
| DHT22 Temperature | Component panel | **14 °C** |
| DHT22 Humidity | Component panel | **88 %** |
| MQ2 Pot (GPIO 34) | Turn to ~25% | **~130 ppm** |
| Heat Pot (GPIO 35) | Turn to ~5% | **~21 °C** |

**Expected Serial Monitor:**
```
==== FreshGuard [BANANA] ====
               PREV       NOW
Temp (C)    :    14.0     14.0
Humidity(%) :    88.0     88.0
Gas (ppm)   :     130      130
Ext Temp(C) :    21.0     21.0
Storage (h) :     8.0      8.5
Heat Load   :    56.0     59.5
Conduction  :   0.084    0.084
COP         :    4.76     5.04
Status      : All Good  |  WiFi:True
```

**Expected Frontend:**
- Green safe banner: *"Heat levels safe — banana storage conditions optimal"*
- Temperature card: green (14 °C, within 13–19 °C)
- Humidity card: blue (88 %, within 80–95 %)
- Gas card: purple (130 ppm, under 220 ppm)
- Heat Load card: orange (59.5 kJ/kg, under 300)
- Conduction card: teal (0.084 W/m²K, under 0.6)
- COP card: green (≥ 3.0)

---

### Banana — Unsafe (`Walls Hot!`)

| Setting | Where | Value |
|---------|-------|-------|
| DHT22 Temperature | Component panel | **17 °C** |
| DHT22 Humidity | Component panel | **70 %** |
| MQ2 Pot (GPIO 34) | Turn to ~15% | **~108 ppm** |
| Heat Pot (GPIO 35) | Turn to **100%** | **45 °C** |

**Expected Serial Monitor:**
```
==== FreshGuard [BANANA] ====
               PREV       NOW
Temp (C)    :    17.0     17.0
Humidity(%) :    70.0     70.0
Gas (ppm)   :     108      108
Ext Temp(C) :    45.0     45.0
Storage (h) :     8.0      8.5
Heat Load   :   224.0    238.0
Conduction  :   3.360    3.360
COP         :    3.57     3.78
Status      : Walls Hot!  |  WiFi:True
```

**Expected Frontend:**
- Red alert banner: *"The storage walls are too hot — outside heat is getting in and warming the banana"*
- Conduction card: **red** (3.360 W/m²K, exceeds 0.6 threshold)
- Heat Load card: orange (still under 300)

**Root cause:** `Q_cond = 0.12 × |45 - 17| = 3.360` — 5× over the 0.6 limit. Fix by lowering the heat pot.

---

### Tomato — Safe (`All Good`)

| Setting | Where | Value |
|---------|-------|-------|
| DHT22 Temperature | Component panel | **12 °C** |
| DHT22 Humidity | Component panel | **87 %** |
| MQ2 Pot (GPIO 34) | Turn to ~20% | **~120 ppm** |
| Heat Pot (GPIO 35) | Turn to ~5% | **~21 °C** |

**Expected Serial Monitor:**
```
==== FreshGuard [TOMATO] ====
               PREV       NOW
Temp (C)    :    12.0     12.0
Humidity(%) :    87.0     87.0
Gas (ppm)   :     120      120
Ext Temp(C) :    21.0     21.0
Storage (h) :     8.0      8.5
Heat Load   :    72.0     76.5
Conduction  :   0.090    0.090
COP         :    3.60     3.83
Status      : All Good  |  WiFi:True
```

**Expected Frontend:**
- Green safe banner: *"Heat levels safe — tomato storage conditions optimal"*
- Temperature card: green (12 °C, within 10–20 °C)
- Humidity card: blue (87 %, within 80–93 %)
- Gas card: purple (120 ppm, under 220 ppm)
- Heat Load card: orange (76.5 kJ/kg, under 250)
- Conduction card: teal (0.090 W/m²K, under 0.5)
- COP card: green (≥ 3.0)

---

### Tomato — Unsafe (`Too Cold!` — Chilling Injury)

| Setting | Where | Value |
|---------|-------|-------|
| DHT22 Temperature | Component panel | **7 °C** |
| DHT22 Humidity | Component panel | **86 %** |
| MQ2 Pot (GPIO 34) | Turn to ~10% | **~100 ppm** |
| Heat Pot (GPIO 35) | Turn to ~5% | **~21 °C** |

**Expected Serial Monitor:**
```
==== FreshGuard [TOMATO] ====
               PREV       NOW
Temp (C)    :     7.0      7.0
Humidity(%) :    86.0     86.0
Gas (ppm)   :     100      100
Ext Temp(C) :    21.0     21.0
Storage (h) :     8.0      8.5
Heat Load   :   112.0    119.0
Conduction  :   0.140    0.140
COP         :    4.57     4.86
Status      : Too Cold!  |  WiFi:True
```

**Expected Frontend:**
- Red alert banner: *"The tomato is too cold — it is suffering cold damage at 7.0°C"*
- Temperature card: **blue** (7 °C, below min 10 °C — chilling injury zone)
- All other cards within range but the biological damage is irreversible

> **Note:** Gas and Heat Load may look normal here, but storing tomato below 10 °C causes permanent cell membrane damage. This is a separate Spoiling class in the ML model.

---

## Dual OLED Display

**OLED 1 — Live readings** (updates every 2s):
```
LIVE Banana
T:14.0C H:88%
G:130 Ext:21.0C
Heat:59.5 Cond:0.084
COP:5.04
>>All Good
```

**OLED 2 — Previous readings** (frozen until next reading):
```
PREV Banana
T:14.0C H:88%
G:128 Ext:20.8C
Heat:56.0 Cond:0.083
COP:4.76
>>All Good
```

On the first reading, OLED 2 shows `Waiting for next reading...` until the second cycle completes.
Switching fruit with the button resets OLED 2 so the new fruit starts with a fresh baseline.

---

## API Endpoints

All endpoints served from `http://localhost:5000`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sensor/latest` | Latest reading with heat metrics and staleness flag |
| GET | `/api/sensor/history?limit=50` | Historical readings (default 50) |
| GET | `/api/sensor/alerts?limit=100` | Alert history, newest first (default 100) |
| GET | `/api/sensor/prediction` | ML prediction from latest live reading |
| POST | `/api/sensor/predict` | ML prediction from manually supplied values |
| GET | `/api/sensor/features` | ML model feature importance |

### POST `/api/sensor/predict` — Request Body
```json
{
  "fruit_type": "banana",
  "temperature": 14.0,
  "humidity": 88,
  "gas": 130,
  "storage_time": 24,
  "temp_delta": 7.0
}
```

### Latest Reading Response
```json
{
  "fruit_type": "banana",
  "temperature": 14.0,
  "humidity": 88.0,
  "gas": 130,
  "storage_time": 24.0,
  "external_temperature": 21.0,
  "temp_delta": 7.0,
  "heat_load": 168.0,
  "cooling_rate": 0.35,
  "time_to_safe": 0.0,
  "conduction": 0.084,
  "cop": 5.04,
  "timestamp": 1700000000000,
  "stale": false,
  "last_seen_seconds": 2
}
```

> `stale` is `true` if the last reading is older than 30 seconds — frontend shows sensor-offline banner.

### Prediction Response
```json
{
  "fruit_type": "banana",
  "condition": "Fresh",
  "risk_level": "Low",
  "shelf_life": "4-6 days",
  "confidence": 98.1,
  "probabilities": {
    "Fresh": 98.1,
    "Ripening": 1.4,
    "Spoiling": 0.5
  }
}
```

---

## Firebase Data Structure

```json
{
  "sensor_data": {
    "<push_id>": {
      "fruit_type": "banana",
      "temperature": 14.0,
      "humidity": 88.0,
      "gas": 130,
      "storage_time": 24.0,
      "external_temperature": 21.0,
      "temp_delta": 7.0,
      "heat_load": 168.0,
      "cooling_rate": 0.35,
      "time_to_safe": 0.0,
      "conduction": 0.084,
      "cop": 5.04,
      "timestamp": 1700000000000
    }
  }
}
```

---

## Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Live heat metrics, stat cards, safe/unsafe banner, cooling estimate |
| `/graphs` | Historical charts — temperature, humidity, gas, temp delta per-fruit thresholds |
| `/prediction` | Live ML prediction + manual form + model feature importance (3 tabs) |
| `/alerts` | Heat-based alert history with fruit filter, limit selector, pagination |

### Stat Cards (Home Page)

| Card | Safe Color | Alert Color | Threshold |
|------|-----------|-------------|-----------|
| Temperature | Green | Red (too hot) / Blue (too cold) | Banana: 13–19 °C · Tomato: 10–20 °C |
| Humidity | Blue | Red | Banana: max 95 % · Tomato: max 93 % |
| Gas Level | Purple | Red | Both: max 220 ppm |
| Heat Load | Orange | Red (darker) | Banana: max 300 · Tomato: max 250 kJ/kg |
| Conduction | Teal | Red | Banana: max 0.6 · Tomato: max 0.5 W/m²K |
| COP | Green ≥ 3.0 | Yellow 1.0–3.0 / Red < 1.0 | Both: min 1.0 |

### Fruit Selector
A **Banana / Tomato toggle** in the navbar updates thresholds, chart ranges, and prediction defaults across all pages instantly — no page reload needed. The selector auto-syncs from the live sensor fruit type but can be overridden manually.

### Sensor Status Badge
- Green — sensor live, shows seconds since last reading
- Orange — sensor offline, shows how long ago last reading was received

---

## ML Model

- Algorithm: Random Forest Classifier (300 trees)
- Features: `fruit_type`, `temperature`, `humidity`, `gas`, `storage_time`, `temp_delta`, `heat_load`
- Classes: `Fresh`, `Ripening`, `Spoiling`
- Training samples: 3500 (500 × 7 classes including tomato chilling injury)
- Accuracy: 100% on test set (clean synthetic boundaries)
- Artifacts: `ml/model.pkl`, `ml/label_encoder.pkl` (produced by `train.py`)

> Requires Python 3.11 or 3.13. If `model.pkl` was trained on a different scikit-learn version, re-run `python train.py` to regenerate it.

### Training Ranges

| Condition | Banana Temp | Tomato Temp | Gas |
|-----------|-------------|-------------|-----|
| Fresh | 13.0–14.8 °C | 10.2–14.8 °C | 80–148 ppm |
| Ripening | 15.2–18.8 °C | 15.2–19.8 °C | 152–218 ppm |
| Spoiling | 19.2–30.0 °C | 20.2–30.0 °C | 222–400 ppm |
| Chilling (tomato) | — | 2.0–9.8 °C | 80–180 ppm → Spoiling |

> 0.2 °C / 2 ppm gap between classes prevents boundary confusion during training.

### Shelf Life Estimates

| Condition | Banana | Tomato |
|-----------|--------|--------|
| Fresh | 4–6 days | 5–7 days |
| Ripening | 1–2 days | 2–3 days |
| Spoiling | < 12 hours | < 24 hours |

---

## Prerequisites

- Node.js ≥ 18
- Python 3.11 or 3.13 (Python 3.14 is **not** supported by scikit-learn yet)
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

## Running Locally

> Running locally is recommended — avoids Render free tier cold starts and rate limits (HTTP 429).

Create `frontend/.env` to point to local backend:
```env
VITE_API_URL=http://localhost:5000
```

Open **4 terminals** and run each service in order:

### Terminal 1 — ML Service
```bash
cd ml
pip install -r requirements.txt
python train.py     # run once — generates model.pkl and label_encoder.pkl
python app.py       # starts ML service on http://localhost:5001
```

> Enable debug mode on Windows: `set FLASK_DEBUG=true && python app.py`
> If using Python 3.14, create a venv with Python 3.13: `py -3.13 -m venv .venv313`

### Terminal 2 — Backend
```bash
cd backend
npm install
npm run dev         # starts API on http://localhost:5000
```

### Terminal 3 — Frontend
```bash
cd frontend
npm install
npm run dev         # starts dashboard on http://localhost:5173
```

### Terminal 4 — Simulator (replaces a real ESP32)
```bash
cd simulator
pip install -r requirements.txt
python simulate.py  # prompts for fruit selection, pushes data every 5s
```

> Prompts you to choose **Banana** or **Tomato** at startup.
> Auto-progresses through Fresh → Ripening → Spoiling over time.
> State persisted in `simulator/simulator_state.txt` — restarts resume from where they left off.
> Skip this terminal if you have a real ESP32 sending data.

---

## Simulator Scenarios

| Scenario | Banana Duration | Tomato Duration |
|----------|----------------|----------------|
| Fresh | 48 hrs | 72 hrs |
| Ripening | 24 hrs | 48 hrs |
| Spoiling | indefinite | indefinite |

The simulator computes and pushes `conduction` and `cop` on every reading, matching the ESP32 hardware output exactly. A small sine wave is applied to simulate natural environmental variation.
