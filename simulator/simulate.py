"""
ESP32 Simulator - pushes fake sensor data to Firebase every 5 seconds.
Simulates realistic fruit storage conditions for banana or tomato,
auto-progressing through Fresh -> Ripening -> Spoiling over time.
"""

import firebase_admin
from firebase_admin import credentials, db
import time
import random
import math
import os
import sys
import json
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

DATABASE_URL = os.environ.get(
    "FIREBASE_DATABASE_URL",
    "https://iotproject-d752a-default-rtdb.firebaseio.com"
)

service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
if service_account_json:
    cred = credentials.Certificate(json.loads(service_account_json))
else:
    cred = credentials.Certificate("../backend/serviceAccountKey.json")

firebase_admin.initialize_app(cred, {"databaseURL": DATABASE_URL})
ref = db.reference("sensor_data")

# --- Fruit selection ---
SUPPORTED_FRUITS = ["banana", "tomato"]

SCENARIOS = {
    "banana": {
        "fresh":    {"temp": (13, 15),  "humidity": (85, 92),  "gas": (80,  150)},
        "ripening": {"temp": (15, 19),  "humidity": (88, 95),  "gas": (150, 220)},
        "spoiling": {"temp": (19, 30),  "humidity": (92, 99),  "gas": (220, 400)},
    },
    "tomato": {
        "fresh":    {"temp": (10, 15),  "humidity": (85, 90),  "gas": (80,  150)},
        "ripening": {"temp": (15, 20),  "humidity": (88, 93),  "gas": (150, 220)},
        "spoiling": {"temp": (20, 30),  "humidity": (90, 99),  "gas": (220, 400)},
    },
}

SCENARIO_ORDER = ["fresh", "ripening", "spoiling"]
SCENARIO_DURATION = {
    "banana": {"fresh": 48, "ripening": 24, "spoiling": 999},
    "tomato": {"fresh": 72, "ripening": 48, "spoiling": 999},
}

def select_fruit():
    fruit = os.environ.get("FRUIT_TYPE", "").lower()
    if fruit in SUPPORTED_FRUITS:
        return fruit
    print("Select fruit to simulate:")
    for i, f in enumerate(SUPPORTED_FRUITS, 1):
        print(f"  {i}. {f.capitalize()}")
    while True:
        choice = input("Enter 1 or 2: ").strip()
        if choice == "1":
            return "banana"
        if choice == "2":
            return "tomato"
        print("Invalid choice, enter 1 or 2.")

def get_reading(fruit, storage_time, scenario):
    r = SCENARIOS[fruit][scenario]
    wave = math.sin(storage_time * 0.3) * 0.5
    temperature = round(random.uniform(*r["temp"]) + wave, 1)
    humidity    = round(random.uniform(*r["humidity"]) + wave * 0.5, 1)
    gas         = round(random.uniform(*r["gas"]) + wave * 2)
    external_temperature = round(temperature + random.uniform(4, 8), 1)
    temp_delta  = round(external_temperature - temperature, 1)

    return {
        "fruit_type":           fruit,
        "temperature":          temperature,
        "humidity":             humidity,
        "gas":                  gas,
        "storage_time":         round(storage_time, 1),
        "external_temperature": external_temperature,
        "temp_delta":           temp_delta,
        "timestamp":            int(time.time() * 1000),
    }

def next_scenario(current):
    idx = SCENARIO_ORDER.index(current)
    return SCENARIO_ORDER[idx + 1] if idx < len(SCENARIO_ORDER) - 1 else current

# --- Load or reset storage_time from state file ---
STATE_FILE = "simulator_state.txt"

def load_state(fruit):
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE) as f:
                lines = f.read().strip().split("\n")
                saved_fruit = lines[0]
                saved_time  = float(lines[1])
                saved_scenario = lines[2]
                saved_elapsed  = float(lines[3])
                if saved_fruit == fruit:
                    print(f"Resuming from saved state: {saved_scenario.upper()}, storage_time={saved_time}h")
                    return saved_time, saved_scenario, saved_elapsed
        except (ValueError, IndexError) as e:
            print(f"Warning: could not parse state file: {e}")
    return 0.0, "fresh", 0.0

def save_state(fruit, storage_time, scenario, elapsed):
    try:
        with open(STATE_FILE, "w") as f:
            f.write(f"{fruit}\n{storage_time}\n{scenario}\n{elapsed}")
    except OSError as e:
        print(f"Warning: could not save state: {e}")

INTERVAL  = 5    # seconds between pushes
TIME_STEP = 0.5  # simulated hours per push

# --- Health check server so Render free tier keeps it alive ---
class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Simulator running")
    def log_message(self, *args):
        pass

def run_simulator():
    fruit = select_fruit()
    storage_time, scenario, scenario_elapsed = load_state(fruit)

    print("=" * 55)
    print(f"  ESP32 Simulator - FreshGuard IoT")
    print(f"  Fruit: {fruit.capitalize()}")
    print(f"  Pushing data to Firebase every {INTERVAL}s")
    print("=" * 55)

    while True:
        reading = get_reading(fruit, storage_time, scenario)
        ref.push(reading)
        print(
            f"[{scenario.upper():8s}] "
            f"Temp: {reading['temperature']:5.1f}C  "
            f"Humidity: {reading['humidity']:5.1f}%  "
            f"Gas: {reading['gas']:4d} ppm  "
            f"Time: {reading['storage_time']:5.1f}h"
        )
        storage_time += TIME_STEP
        scenario_elapsed += TIME_STEP
        if scenario_elapsed >= SCENARIO_DURATION[fruit][scenario]:
            old = scenario
            scenario = next_scenario(scenario)
            scenario_elapsed = 0
            if scenario != old:
                print(f"\n  Condition changed: {old.upper()} -> {scenario.upper()}\n")
        save_state(fruit, storage_time, scenario, scenario_elapsed)
        time.sleep(INTERVAL)

thread = threading.Thread(target=run_simulator, daemon=True)
thread.start()

port = int(os.environ.get("PORT", 8080))
HTTPServer(("0.0.0.0", port), HealthHandler).serve_forever()
