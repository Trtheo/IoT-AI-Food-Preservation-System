import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib

np.random.seed(42)

N = 500  # samples per class

# ─────────────────────────────────────────────
# BANANA (fruit_type = 0)
# Fresh:    13.0–14.8°C | gas 80–148 ppm  | storage  0–47h
# Ripening: 15.2–18.8°C | gas 152–218 ppm | storage 49–95h
# Spoiling: 19.2–30.0°C | gas 222–400 ppm | storage 97–168h
# 0.2°C / 2 ppm gap between classes to avoid boundary confusion
# ─────────────────────────────────────────────
banana_fresh = pd.DataFrame({
    "fruit_type":   [0] * N,
    "temperature":  np.random.uniform(13.0, 14.8, N),
    "humidity":     np.random.uniform(85.0, 92.0, N),
    "gas":          np.random.uniform(80,   148,   N),
    "storage_time": np.random.uniform(0,    47,    N),
    "temp_delta":   np.random.uniform(2.0,  6.0,   N),
    "condition":    ["Fresh"] * N,
})
banana_ripening = pd.DataFrame({
    "fruit_type":   [0] * N,
    "temperature":  np.random.uniform(15.2, 18.8, N),
    "humidity":     np.random.uniform(88.0, 94.5, N),
    "gas":          np.random.uniform(152,  218,   N),
    "storage_time": np.random.uniform(49,   95,    N),
    "temp_delta":   np.random.uniform(4.0,  9.0,   N),
    "condition":    ["Ripening"] * N,
})
banana_spoiling = pd.DataFrame({
    "fruit_type":   [0] * N,
    "temperature":  np.random.uniform(19.2, 30.0, N),
    "humidity":     np.random.uniform(92.0, 99.0, N),
    "gas":          np.random.uniform(222,  400,   N),
    "storage_time": np.random.uniform(97,   168,   N),
    "temp_delta":   np.random.uniform(6.0,  14.0,  N),
    "condition":    ["Spoiling"] * N,
})

# ─────────────────────────────────────────────
# TOMATO (fruit_type = 1)
# Fresh:    10.2–14.8°C | gas 80–148 ppm  | storage  0–71h
# Ripening: 15.2–19.8°C | gas 152–218 ppm | storage 73–119h
# Spoiling: 20.2–30.0°C | gas 222–400 ppm | storage 121–200h
# Chilling: 2.0–9.8°C   | gas 80–180 ppm  | storage 12–96h  → Spoiling
# ─────────────────────────────────────────────
tomato_fresh = pd.DataFrame({
    "fruit_type":   [1] * N,
    "temperature":  np.random.uniform(10.2, 14.8, N),
    "humidity":     np.random.uniform(85.0, 90.0, N),
    "gas":          np.random.uniform(80,   148,   N),
    "storage_time": np.random.uniform(0,    71,    N),
    "temp_delta":   np.random.uniform(2.0,  6.0,   N),
    "condition":    ["Fresh"] * N,
})
tomato_ripening = pd.DataFrame({
    "fruit_type":   [1] * N,
    "temperature":  np.random.uniform(15.2, 19.8, N),
    "humidity":     np.random.uniform(88.0, 92.5, N),
    "gas":          np.random.uniform(152,  218,   N),
    "storage_time": np.random.uniform(73,   119,   N),
    "temp_delta":   np.random.uniform(4.0,  9.0,   N),
    "condition":    ["Ripening"] * N,
})
tomato_spoiling = pd.DataFrame({
    "fruit_type":   [1] * N,
    "temperature":  np.random.uniform(20.2, 30.0, N),
    "humidity":     np.random.uniform(90.0, 99.0, N),
    "gas":          np.random.uniform(222,  400,   N),
    "storage_time": np.random.uniform(121,  200,   N),
    "temp_delta":   np.random.uniform(6.0,  14.0,  N),
    "condition":    ["Spoiling"] * N,
})

# Chilling injury — large sample so model learns this edge case well
tomato_chilling = pd.DataFrame({
    "fruit_type":   [1] * N,
    "temperature":  np.random.uniform(2.0,  9.8,  N),
    "humidity":     np.random.uniform(80.0, 92.0, N),
    "gas":          np.random.uniform(80,   180,   N),   # gas looks normal
    "storage_time": np.random.uniform(12,   96,    N),
    "temp_delta":   np.random.uniform(1.0,  5.0,   N),
    "condition":    ["Spoiling"] * N,                    # but it IS spoiling
})

df = pd.concat([
    banana_fresh, banana_ripening, banana_spoiling,
    tomato_fresh, tomato_ripening, tomato_spoiling,
    tomato_chilling,
], ignore_index=True).sample(frac=1, random_state=42).reset_index(drop=True)

le = LabelEncoder()
df["condition_encoded"] = le.fit_transform(df["condition"])

FEATURES = ["fruit_type", "temperature", "humidity", "gas", "storage_time", "temp_delta"]
X = df[FEATURES]
y = df["condition_encoded"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    max_features="sqrt",
    random_state=42,
    n_jobs=-1,
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\nTest Accuracy: {acc * 100:.2f}%\n")
print(classification_report(y_test, y_pred, target_names=le.classes_))

joblib.dump(model, "model.pkl")
joblib.dump(le, "label_encoder.pkl")
print(f"Model saved: model.pkl  |  Samples: {len(df)}  |  Features: {FEATURES}")
