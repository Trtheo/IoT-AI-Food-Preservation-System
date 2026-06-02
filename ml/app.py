from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
LE_PATH = os.path.join(BASE_DIR, "label_encoder.pkl")

if not os.path.exists(MODEL_PATH) or not os.path.exists(LE_PATH):
    import subprocess, sys
    subprocess.run([sys.executable, os.path.join(BASE_DIR, "train.py")], check=True)

app = Flask(__name__)
CORS(app)

model = joblib.load(MODEL_PATH)
le = joblib.load(LE_PATH)

# Per-fruit, per-condition shelf life and risk
SHELF_LIFE = {
    "banana": {"Fresh": "4-6 days", "Ripening": "1-2 days", "Spoiling": "< 12 hours"},
    "tomato": {"Fresh": "5-7 days", "Ripening": "2-3 days", "Spoiling": "< 24 hours"},
}
RISK_LEVEL = {
    "Fresh": "Low",
    "Ripening": "Medium",
    "Spoiling": "High",
}
FRUIT_TYPE_MAP = {"banana": 0, "tomato": 1}

REQUIRED_FIELDS = ["fruit_type", "temperature", "humidity", "gas", "storage_time", "temp_delta"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body received"}), 400

        missing = [f for f in REQUIRED_FIELDS if f not in data or data[f] is None]
        if missing:
            return jsonify({"error": f"Missing fields: {missing}"}), 400

        fruit_name = str(data["fruit_type"]).lower()
        if fruit_name not in FRUIT_TYPE_MAP:
            return jsonify({"error": "fruit_type must be 'banana' or 'tomato'"}), 400

        try:
            features = np.array([[
                FRUIT_TYPE_MAP[fruit_name],
                float(data["temperature"]),
                float(data["humidity"]),
                float(data["gas"]),
                float(data["storage_time"]),
                float(data["temp_delta"]),
            ]])
        except (ValueError, TypeError) as e:
            return jsonify({"error": f"Invalid numeric value: {str(e)}"}), 400

        pred_encoded = model.predict(features)[0]
        proba = model.predict_proba(features)[0]
        condition = le.inverse_transform([pred_encoded])[0]

        return jsonify({
            "fruit_type": fruit_name,
            "condition": condition,
            "risk_level": RISK_LEVEL[condition],
            "shelf_life": SHELF_LIFE[fruit_name][condition],
            "confidence": round(float(max(proba)) * 100, 1),
            "probabilities": {
                cls: round(float(p) * 100, 1)
                for cls, p in zip(le.classes_, proba)
            },
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ML service running"})


@app.route("/features", methods=["GET"])
def feature_importance():
    features = ["fruit_type", "temperature", "humidity", "gas", "storage_time", "temp_delta"]
    importance = model.feature_importances_
    return jsonify({
        "features": [
            {"name": f, "importance": round(float(i) * 100, 1)}
            for f, i in sorted(zip(features, importance), key=lambda x: -x[1])
        ]
    })


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=debug)
