# FreshGuard - Manual Prediction Test Cases

Use these values in the **Manual** tab on the `/prediction` page.

---

## How to Use
1. Go to `http://localhost:5173/prediction`
2. Click **Manual** tab
3. Enter the values below and click **Run Prediction**

---

## Banana

**Legal Ranges:**
| Sensor | Safe Range |
|--------|-----------|
| Temperature | 13 – 19 °C |
| Humidity | 80 – 95 % |
| Gas | 80 – 220 ppm |
| Storage Time | any (hrs) |
| Temp Delta | any (°C) |

---

### ✅ SAFE — Example 1 (Early Fresh)

| Field | Value |
|-------|-------|
| Temperature | 14 °C |
| Humidity | 88 % |
| Gas | 120 ppm |
| Storage Time | 12 hrs |
| Temp Delta | 5 °C |

**Expected:** Fresh · Risk: Low · Shelf Life: 4–6 days

---

### ✅ SAFE — Example 2 (Mid Fresh)

| Field | Value |
|-------|-------|
| Temperature | 16 °C |
| Humidity | 91 % |
| Gas | 160 ppm |
| Storage Time | 36 hrs |
| Temp Delta | 6 °C |

**Expected:** Ripening · Risk: Medium · Shelf Life: 1–2 days

---

### ❌ UNSAFE — Example 1 (High Temperature)

| Field | Value |
|-------|-------|
| Temperature | 25 °C ⚠ (max 19 °C) |
| Humidity | 95 % |
| Gas | 280 ppm ⚠ (max 220 ppm) |
| Storage Time | 100 hrs |
| Temp Delta | 10 °C |

**Expected:** Spoiling · Risk: High · Shelf Life: < 12 hours

---

### ❌ UNSAFE — Example 2 (Low Temperature)

| Field | Value |
|-------|-------|
| Temperature | 10 °C ⚠ (min 13 °C) |
| Humidity | 92 % |
| Gas | 240 ppm ⚠ (max 220 ppm) |
| Storage Time | 110 hrs |
| Temp Delta | 8 °C |

**Expected:** Spoiling · Risk: High · Shelf Life: < 12 hours

---

## Tomato

**Legal Ranges:**
| Sensor | Safe Range |
|--------|-----------|
| Temperature | 10 – 20 °C (below 10 °C = chilling injury) |
| Humidity | 80 – 93 % |
| Gas | 80 – 220 ppm |
| Storage Time | any (hrs) |
| Temp Delta | any (°C) |

---

### ✅ SAFE — Example 1 (Early Fresh)

| Field | Value |
|-------|-------|
| Temperature | 13 °C |
| Humidity | 87 % |
| Gas | 110 ppm |
| Storage Time | 24 hrs |
| Temp Delta | 5 °C |

**Expected:** Fresh · Risk: Low · Shelf Life: 5–7 days

---

### ✅ SAFE — Example 2 (Mid Fresh)

| Field | Value |
|-------|-------|
| Temperature | 17 °C |
| Humidity | 90 % |
| Gas | 180 ppm |
| Storage Time | 80 hrs |
| Temp Delta | 6 °C |

**Expected:** Ripening · Risk: Medium · Shelf Life: 2–3 days

---

### ❌ UNSAFE — Example 1 (Chilling Injury)

| Field | Value |
|-------|-------|
| Temperature | 6 °C ⚠ (below 10 °C = chilling injury) |
| Humidity | 85 % |
| Gas | 130 ppm |
| Storage Time | 48 hrs |
| Temp Delta | 3 °C |

**Expected:** Spoiling · Risk: High · Shelf Life: < 24 hours
> Gas looks normal but low temperature causes chilling injury — the model correctly predicts Spoiling.

---

### ❌ UNSAFE — Example 2 (High Temperature + High Gas)

| Field | Value |
|-------|-------|
| Temperature | 26 °C ⚠ (max 20 °C) |
| Humidity | 95 % ⚠ (max 93 %) |
| Gas | 300 ppm ⚠ (max 220 ppm) |
| Storage Time | 130 hrs |
| Temp Delta | 9 °C |

**Expected:** Spoiling · Risk: High · Shelf Life: < 24 hours

---

## Wokwi Live Demo (DHT22 + Potentiometer)

| Step | Action | Expected on Frontend |
|------|--------|---------------------|
| 1 | Temp=15, Hum=88, Pot=30% → Banana | SAFE  |
| 2 | Temp=25 → Banana | T HIGH  |
| 3 | Press button → switch to Tomato | Navbar shows Tomato |
| 4 | Temp=6 → Tomato | CHILLING  |
| 5 | Temp=13, Hum=87, Pot=10% → Tomato | SAFE  |
| 6 | Pot=100% → Tomato | GAS HIGH  |

> Each push updates Firebase every 2s → frontend reflects changes instantly.
