# FreshGuard — Frontend Cards & UI Explanations

This document explains the role and function of every card and panel on the FreshGuard dashboard, intended for defense presentation.

---

## Home Page (`/`) — Stat Cards

The home page shows 6 real-time stat cards pulled from the latest sensor reading via Firebase. Each card has a color that changes based on whether the value has crossed its fruit-specific threshold.

---

### 1. Temperature Card

**Color logic:**
- Green — temperature is within the safe range
- Blue — temperature is below the minimum (too cold / chilling injury risk)
- Red — temperature is above the maximum (too hot)

| Fruit | Safe Range |
|-------|-----------|
| Banana | 13 °C – 19 °C |
| Tomato | 10 °C – 20 °C |

**Role:** Temperature is treated as a *symptom* of heat accumulation, not the primary cause. The card turns blue for tomato below 10 °C to visually flag chilling injury — a biological condition where the cell membranes suffer irreversible damage even when gas levels look normal. It turns red when the fruit is overheating. However, in the alert priority order, Heat Load and Conduction are checked first because they reveal the *cause* behind the temperature reading.

---

### 2. Humidity Card

**Color logic:**
- Blue — humidity is within the safe range
- Red — humidity has exceeded the maximum threshold

| Fruit | Max Threshold |
|-------|--------------|
| Banana | 95 % |
| Tomato | 93 % |

**Role:** High humidity accelerates spoilage by promoting mould growth and speeding up the chemical reactions driven by heat. The card is blue by default because humidity in a normal storage environment is healthy at moderate levels. It turns red only when moisture becomes a spoilage risk. The status message triggered is `Too Humid!`.

---

### 3. Gas Level Card

**Color logic:**
- Purple — gas is within the safe range (below 220 ppm)
- Red — gas has exceeded 220 ppm for both fruits

**How the value is measured:**
```
voltage = adc_val × (3.3 / 4095)
ppm     = 80 + (voltage / 3.3) × 320   [clamped: 80–400 ppm]
```

**Role:** The MQ2 sensor detects ethylene and spoilage gases released by fruit as it ripens and decomposes. Rising gas levels are a direct biological sign that the fruit is going bad. Gas is elevated by heat — so this card is a *downstream symptom* of the heat-driven spoilage process. The status message triggered is `Going Bad!`. It sits last in the alert priority because by the time gas is high, the damage is already advanced.

---

### 4. Heat Load Card

**Color logic:**
- Orange — heat load is within range (accumulating but not yet critical)
- Red — heat load has exceeded the threshold

| Fruit | Max Threshold |
|-------|--------------|
| Banana | 300 kJ/kg |
| Tomato | 250 kJ/kg |

**Formula:**
```
heat_load = temp_delta × storage_time
```
Where `temp_delta` = external temperature − storage temperature, and `storage_time` is in hours.

**Role:** This is the most important card on the dashboard. It answers the question: *how much total thermal energy has the fruit absorbed since it was stored?* A fruit can be sitting at an acceptable temperature right now, but if it has been exposed to a high temperature gap for many hours, the cumulative heat damage is already done. The card being orange does not mean danger — it means heat is being tracked. It turns red the moment the threshold is crossed, triggering the `Too Hot!` status which has the highest priority in the alert logic. This card is the system's core innovation — treating spoilage as an energy accumulation problem, not just a temperature snapshot.

---

### 5. Conduction Card

**Color logic:**
- Teal — conduction is within the safe range (walls are insulating well)
- Red — conduction has exceeded the threshold (outside heat is leaking in)

| Fruit | Max Threshold |
|-------|--------------|
| Banana | 0.6 W/m²K |
| Tomato | 0.5 W/m²K |

**Formula (Fourier's Law of Conduction):**
```
Q_cond = k_wall × |T_external − T_storage|
```
Where `k_wall` = 0.12 for banana, 0.10 for tomato.

**Role:** This card measures the *source* of the heat problem. While Heat Load tells you how much damage has accumulated, Conduction tells you *why* — the storage walls are failing to block external heat. A large gap between outside and inside temperature means heat is actively flowing in through the walls. When this card turns red, it means the physical barrier between the fruit and the hot environment is being overwhelmed. The status message is `Walls Hot!` and it is the second highest priority in the alert logic, after Heat Load. In the current demo with external temperature at 45 °C:
```
Q_cond = 0.12 × |45 − 17| = 3.252 W/m²K   → 5× over the 0.6 limit → RED
```

---

### 6. COP Card (Coefficient of Performance)

**Color logic:**
- Green — COP ≥ 3.0 (cooling system is efficient)
- Yellow — COP between 1.0 and 3.0 (marginal efficiency)
- Red — COP < 1.0 (cooling is losing the heat battle)

**Formula:**
```
COP = (cooling_rate × storage_time) / conduction
```
Where `cooling_rate = k × |T_storage − T_external|` from Newton's Law of Cooling.

**Role:** COP answers the critical question: *is the cooling system winning or losing against the incoming heat?* A COP of 3.0 means the system removes 3 units of heat for every 1 unit leaking in — very efficient. A COP below 1.0 means more heat is entering than leaving — the cooling has already lost and spoilage will accelerate regardless of other readings. It is the third priority in the alert logic, sitting between Conduction and Temperature. The card uses three colors intentionally to show a gradient of risk rather than a simple safe/unsafe split.

---

## Home Page — Additional UI Elements

### Safe / Unsafe Banner

Displayed just above the stat cards. Shows a green banner when all conditions are within thresholds, or a red banner with a specific human-readable reason when any threshold is crossed.

The message follows the same heat-first priority order as the status logic:

| Condition | Banner Message |
|-----------|---------------|
| Heat Load exceeded | "The [fruit] is too hot — it has absorbed too much heat and may be spoiling" |
| Conduction exceeded | "The storage walls are too hot — outside heat is getting in and warming the [fruit]" |
| COP < 1.0 | "The cooling system is not working well enough — it cannot remove heat fast enough" |
| Tomato < 10 °C | "The tomato is too cold — it is suffering cold damage at X°C" |
| Temp too low | "The [fruit] is too cold — storage temperature X°C is below safe range" |
| Temp too high | "The [fruit] is too hot — storage temperature X°C is above safe range" |
| Humidity exceeded | "The air is too humid — moisture at X% is speeding up spoilage" |
| Gas exceeded | "The [fruit] is going bad — gas level X ppm is too high" |
| All safe | "Heat levels safe — [fruit] storage conditions optimal" |

---

### Sensor Status Badge

- Green badge — sensor is live, shows how many seconds ago the last reading was received
- Orange badge — sensor is offline (no reading for more than 30 seconds), shows how long ago

This uses the `stale` flag from the backend, which is set to `true` when the latest Firebase reading is older than 30 seconds.

---

### Cooling Estimate Banner

Shown in orange below the stat cards when `time_to_safe > 0`. Displays:
- Estimated hours to bring the fruit temperature back to its safe target (14 °C for banana, 12 °C for tomato), calculated using Newton's Law of Cooling
- Current heat removal rate in °C/h

---

### Details Table

A table below the cards showing raw values: Fruit Type, Storage Time, External Temp, Temp Delta, Cooling Rate, Conduction, COP, and Last Updated timestamp. Used to verify the physics calculations manually.

---

## Graphs Page (`/graphs`) — Historical Charts

Displays 5 line charts over the last N readings (selectable: 20, 50, 100), filtered by the active fruit type.

| Chart | Unit | Threshold Line |
|-------|------|---------------|
| Temperature | °C | Min and Max per fruit |
| Humidity | % | Max per fruit |
| Gas Level | ppm | Max 220 ppm |
| Temp Delta (ext−int) | °C | Max 10 °C |
| Heat Load | kJ/kg | 300 (banana) / 250 (tomato) |

**Role of each chart:**

- **Temperature** — tracks whether storage temperature is staying within the safe window over time. Useful for spotting gradual warming trends before they reach the threshold.
- **Humidity** — shows whether moisture in storage is building up. A rising trend toward the max threshold is an early warning sign.
- **Gas Level** — the most direct indicator of active spoilage. A rising gas trend means ethylene production is increasing, which is irreversible.
- **Temp Delta** — shows the temperature gap between outside and inside over time. A rising delta means the walls are under increasing thermal pressure, which feeds directly into Conduction.
- **Heat Load** — the cumulative heat energy chart. It always rises over time; the question is how fast. A steep slope means rapid heat absorption. When the line approaches the threshold, action must be taken.

Each chart shows a summary row with Latest, Average, Min, and Max values. An alert badge appears on the chart if any readings crossed the threshold.

---

## Prediction Page (`/prediction`) — Three Tabs

### Live Tab

Shows the ML model's prediction based on the latest sensor reading from Firebase. Displays:
- **Condition** — Fresh, Ripening, or Spoiling (with icon: green tick, yellow warning, red X)
- **Risk Level** — Low, Medium, or High
- **Shelf Life** — estimated remaining shelf life based on condition and fruit type
- **Confidence** — the model's confidence percentage for the predicted class
- **Probability Breakdown** — bar chart showing probabilities for all three classes (Fresh / Ripening / Spoiling)

| Condition | Banana Shelf Life | Tomato Shelf Life | Risk |
|-----------|------------------|------------------|------|
| Fresh | 4–6 days | 5–7 days | Low |
| Ripening | 1–2 days | 2–3 days | Medium |
| Spoiling | < 12 hours | < 24 hours | High |

### Manual Tab

A form where the user can enter custom values (temperature, humidity, gas, storage time, temp delta) and run a prediction without live sensor data. The form defaults update automatically when the fruit selector in the navbar changes. Useful for demonstrating how the model responds to hypothetical scenarios — for example, manually entering spoiling conditions to show the model predicting Spoiling with high confidence.

### Model Tab

Shows the trained Random Forest model's feature importance — which input features had the most influence on predictions. Displayed as horizontal bars. Features include: `fruit_type`, `temperature`, `humidity`, `gas`, `storage_time`, `temp_delta`, `heat_load`. This demonstrates that the model is driven by the physically meaningful features and not just memorising data.

---

## Alerts Page (`/alerts`) — Alert History

Shows a list of all past sensor readings that triggered at least one alert condition, pulled from Firebase history.

**Features:**
- Filter by fruit type (All / Banana / Tomato) — syncs automatically with the navbar fruit selector
- Limit selector (last 50, 100, or 200 readings)
- Pagination (10 alerts per page)
- Each alert card shows timestamp, fruit type, and the exact human-readable alert messages

**Chilling Injury alerts** appear in blue instead of red to visually distinguish biological cold damage (irreversible) from heat-based alerts (recoverable). A `Chilling Injury` badge is shown on the card.

**Role:** The alerts page provides a full audit trail of when and why conditions became unsafe. During a defense, this demonstrates that the system does not just show current state but maintains a historical record of every spoilage event.

---

## Fruit Selector (Navbar)

A Banana / Tomato toggle in the top navigation bar. Changing it instantly updates:
- All threshold values on the Home stat cards
- Chart threshold lines on the Graphs page
- Form default values on the Prediction manual tab
- Alert filter on the Alerts page

The selector auto-syncs to the fruit type being reported by the live sensor but can be overridden manually. This allows the dashboard to be used for both fruits from the same interface without any page reload.
