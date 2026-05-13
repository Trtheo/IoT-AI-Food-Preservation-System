import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
import joblib

np.random.seed(42)

# --- Banana: climacteric, ethylene-driven, safe at 13-15°C, 85-95% RH ---
# fruit_type = 0
banana_fresh = pd.DataFrame({
    "fruit_type":           [0] * 170,
    "temperature":          np.random.uniform(13, 15, 170),
    "humidity":             np.random.uniform(85, 92, 170),
    "gas":                  np.random.uniform(80, 150, 170),
    "storage_time":         np.random.uniform(0, 48, 170),
    "temp_delta":           np.random.uniform(2, 6, 170),
    "condition":            ["Fresh"] * 170,
})
banana_ripening = pd.DataFrame({
    "fruit_type":           [0] * 165,
    "temperature":          np.random.uniform(15, 19, 165),
    "humidity":             np.random.uniform(88, 95, 165),
    "gas":                  np.random.uniform(150, 220, 165),
    "storage_time":         np.random.uniform(48, 96, 165),
    "temp_delta":           np.random.uniform(4, 9, 165),
    "condition":            ["Ripening"] * 165,
})
banana_spoiling = pd.DataFrame({
    "fruit_type":           [0] * 165,
    "temperature":          np.random.uniform(19, 30, 165),
    "humidity":             np.random.uniform(92, 99, 165),
    "gas":                  np.random.uniform(220, 400, 165),
    "storage_time":         np.random.uniform(96, 168, 165),
    "temp_delta":           np.random.uniform(6, 14, 165),
    "condition":            ["Spoiling"] * 165,
})

# --- Tomato: climacteric, chilling injury < 10°C, safe at 10-15°C, 85-90% RH ---
# fruit_type = 1
tomato_fresh = pd.DataFrame({
    "fruit_type":           [1] * 170,
    "temperature":          np.random.uniform(10, 15, 170),
    "humidity":             np.random.uniform(85, 90, 170),
    "gas":                  np.random.uniform(80, 150, 170),
    "storage_time":         np.random.uniform(0, 72, 170),
    "temp_delta":           np.random.uniform(2, 6, 170),
    "condition":            ["Fresh"] * 170,
})
tomato_ripening = pd.DataFrame({
    "fruit_type":           [1] * 165,
    "temperature":          np.random.uniform(15, 20, 165),
    "humidity":             np.random.uniform(88, 93, 165),
    "gas":                  np.random.uniform(150, 220, 165),
    "storage_time":         np.random.uniform(72, 120, 165),
    "temp_delta":           np.random.uniform(4, 9, 165),
    "condition":            ["Ripening"] * 165,
})
tomato_spoiling = pd.DataFrame({
    "fruit_type":           [1] * 165,
    "temperature":          np.random.uniform(20, 30, 165),
    "humidity":             np.random.uniform(90, 99, 165),
    "gas":                  np.random.uniform(220, 400, 165),
    "storage_time":         np.random.uniform(120, 200, 165),
    "temp_delta":           np.random.uniform(6, 14, 165),
    "condition":            ["Spoiling"] * 165,
})

# Chilling injury: tomato stored below 10°C → Spoiling even with low gas
tomato_chilling = pd.DataFrame({
    "fruit_type":           [1] * 100,
    "temperature":          np.random.uniform(2, 9.9, 100),
    "humidity":             np.random.uniform(80, 92, 100),
    "gas":                  np.random.uniform(80, 180, 100),   # gas looks fine
    "storage_time":         np.random.uniform(12, 96, 100),
    "temp_delta":           np.random.uniform(1, 5, 100),
    "condition":            ["Spoiling"] * 100,                # but it's spoiling
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

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print(classification_report(y_test, model.predict(X_test), target_names=le.classes_))

joblib.dump(model, "model.pkl")
joblib.dump(le, "label_encoder.pkl")
print("Model saved: model.pkl  |  Features:", FEATURES)
