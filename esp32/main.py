# Project: FreshGuard - Food Preservation Monitoring System
# Developer: Theophile Niyigaba
# Date: 15/4/2026

from machine import Pin, PWM, SoftI2C, ADC
import oled_library
import dht
import network
import urequests
import ujson
import utime
import math

# --- Pin Setup ---
dht_sensor = dht.DHT22(Pin(4))
red_led    = Pin(14, Pin.OUT)
green_led  = Pin(27, Pin.OUT)
buzzer     = PWM(Pin(18, Pin.OUT))
buzzer.freq(1000)
button     = Pin(25, Pin.IN, Pin.PULL_UP)
gas_sensor  = ADC(Pin(34))          # MQ2 AOUT → GPIO 34
gas_sensor.atten(ADC.ATTN_11DB)     # 0–3.6V range
heat_sensor = ADC(Pin(35))
heat_sensor.atten(ADC.ATTN_11DB)
oled = oled_library.SSD1306_I2C(width=128, height=64, i2c=SoftI2C(scl=Pin(23), sda=Pin(22)))

# --- WiFi ---
WIFI_SSID     = "Wokwi-GUEST"
WIFI_PASSWORD = ""

# --- Firebase ---
FIREBASE_DB  = "https://iotproject-d752a-default-rtdb.firebaseio.com"
FIREBASE_SECRET = "YOUR_FIREBASE_DATABASE_SECRET"  # replace with your secret in Wokwi
FIREBASE_URL = FIREBASE_DB + "/sensor_data.json?auth=" + FIREBASE_SECRET

# --- Thresholds ---
THRESHOLDS = {
    "banana": {"temp_min": 13, "temp_max": 19, "hum_max": 95, "gas_max": 220},
    "tomato": {"temp_min": 10, "temp_max": 20, "hum_max": 93, "gas_max": 220},
}

# --- Newton's Law of Cooling constants ---
COOLING_K = {"banana": 0.05, "tomato": 0.04}
SAFE_TEMP  = {"banana": 14.0, "tomato": 12.0}

def calc_heat(fruit, temp, ext_temp, storage_time):
    k      = COOLING_K[fruit]
    T_safe = SAFE_TEMP[fruit]
    delta  = ext_temp - temp

    heat_load   = round(delta * storage_time, 2)
    cooling_rate = round(k * abs(temp - ext_temp), 3)

    try:
        ratio = (T_safe - ext_temp) / (temp - ext_temp)
        time_to_safe = round(-math.log(ratio) / k, 1) if ratio > 0 else 0.0
    except (ZeroDivisionError, ValueError):
        time_to_safe = 0.0

    return heat_load, cooling_rate, time_to_safe

FRUITS = ["banana", "tomato"]

# --- State Persistence ---
def load_state():
    try:
        with open("state.txt") as f:
            lines = f.read().strip().split("\n")
            return int(lines[0]), float(lines[1])
    except OSError:
        return 0, 0.0
    except (ValueError, IndexError) as e:
        print("State parse error:", e)
        return 0, 0.0

def save_state(f_idx, s_time):
    try:
        with open("state.txt", "w") as f:
            f.write("{}\n{}".format(f_idx, s_time))
    except OSError as e:
        print("State save error:", e)

# --- WiFi Connect ---
def connect_wifi():
    global wifi_connected
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    oled.fill(0)
    oled.text("Connecting WiFi", 0, 0)
    oled.text("Please wait...", 0, 12)
    oled.show()
    for _ in range(10):
        if wlan.isconnected():
            wifi_connected = True
            oled.fill(0)
            oled.text("WiFi Connected!", 0, 0)
            oled.show()
            utime.sleep(1)
            return
        utime.sleep(0.5)
    wifi_connected = False
    oled.fill(0)
    oled.text("WiFi FAILED", 0, 0)
    oled.text("Offline mode", 0, 12)
    oled.show()
    utime.sleep(1)

# --- Fruit Selection on Boot ---
def select_fruit_on_boot(saved_index):
    idx = saved_index
    deadline = utime.ticks_ms() + 4000

    while utime.ticks_diff(deadline, utime.ticks_ms()) > 0:
        remaining = utime.ticks_diff(deadline, utime.ticks_ms()) // 1000
        fruit_label = FRUITS[idx][0].upper() + FRUITS[idx][1:]
        oled.fill(0)
        oled.text("Select Fruit:", 0, 0)
        oled.text("> " + fruit_label, 0, 16)
        oled.text("Press to toggle", 0, 32)
        oled.text("Auto in {}s".format(remaining), 0, 48)
        oled.show()

        if button.value() == 0:
            idx = (idx + 1) % 2
            utime.sleep_ms(300)

        utime.sleep_ms(100)

    fruit_label = FRUITS[idx][0].upper() + FRUITS[idx][1:]
    oled.fill(0)
    oled.text("Selected:", 0, 0)
    oled.text(fruit_label, 0, 20)
    oled.show()
    utime.sleep(1)
    return idx

# --- MQ2 ADC to gas ppm conversion ---
# MQ2 AOUT voltage rises as gas concentration increases.
# At clean air: ~0.3V (ADC ~341)  → ~80 ppm baseline
# At high gas:  ~3.0V (ADC ~3414) → ~400 ppm
# Linear approximation across the fruit spoilage range (80–400 ppm).
# Formula: voltage = adc_val * (3.3 / 4095)
#          ppm     = 80 + (voltage / 3.3) * 320
def map_gas(adc_val):
    voltage = adc_val * (3.3 / 4095)
    ppm     = round(80 + (voltage / 3.3) * 320)
    return max(80, min(400, ppm))   # clamp to valid sensor range

# --- Push to Firebase ---
def push_to_firebase(payload):
    for attempt in range(3):
        try:
            res = urequests.post(
                FIREBASE_URL,
                headers={"Content-Type": "application/json"},
                data=ujson.dumps(payload)
            )
            status = res.status_code
            res.content  # fully read response before closing
            res.close()
            if status == 200:
                return True
            print("Firebase rejected (attempt {}): HTTP {}".format(attempt + 1, status))
        except (OSError, ValueError) as e:
            print("Firebase push error (attempt {}): {}".format(attempt + 1, e))
            utime.sleep_ms(500)
    return False

# --- Build Status Message ---
def get_status(fruit, temp, hum, gas, t):
    if fruit == "tomato" and temp < 10:
        return "CHILLING!"
    if temp < t["temp_min"]:
        return "T LOW!"
    if temp > t["temp_max"]:
        return "T HIGH!"
    if hum > t["hum_max"]:
        return "HUM HIGH!"
    if gas > t["gas_max"]:
        return "GAS HIGH!"
    return "SAFE"

# Unix epoch offset for Wokwi (utime starts from 0 on boot)
EPOCH_OFFSET = 1779062400  # May 18, 2026 00:00:00 UTC

# --- Boot Sequence ---
wifi_connected = False
connect_wifi()
fruit_index, storage_time = load_state()
fruit_index = select_fruit_on_boot(fruit_index)
save_state(fruit_index, storage_time)

alert_ack = True
last_btn  = 1

# --- Main Loop ---
while True:
    fruit = FRUITS[fruit_index]
    t     = THRESHOLDS[fruit]

    try:
        dht_sensor.measure()
        temp = dht_sensor.temperature()
        hum  = dht_sensor.humidity()
    except OSError as e:
        print("DHT22 read error:", e)
        # Skip this cycle — do not push bad data
        for _ in range(20):
            utime.sleep_ms(100)
        continue

    # MQ2 (GPIO 34) → gas ppm 80–400 via voltage-to-ppm conversion
    gas      = map_gas(gas_sensor.read())
    ext_temp     = round(20 + (heat_sensor.read() / 4095) * 25, 1)  # 20–45 °C range
    temp_delta   = round(ext_temp - temp, 1)
    storage_time = round(storage_time + 0.5, 1)
    heat_load, cooling_rate, time_to_safe = calc_heat(fruit, temp, ext_temp, storage_time)
    ts = (EPOCH_OFFSET + utime.time()) * 1000

    unsafe = (
        temp < t["temp_min"] or
        temp > t["temp_max"] or
        hum  > t["hum_max"]  or
        gas  > t["gas_max"]  or
        (fruit == "tomato" and temp < 10)
    )

    if button.value() == 0 and last_btn == 1:
        alert_ack = True
        buzzer.duty(0)
        last_btn = 0
    elif button.value() == 1:
        last_btn = 1

    if unsafe and not alert_ack:
        red_led.on()
        green_led.off()
        buzzer.duty(512)
    else:
        red_led.off()
        green_led.on()
        buzzer.duty(0)
        if not unsafe:
            alert_ack = False

    status_msg = get_status(fruit, temp, hum, gas, t)

    payload = {
        "fruit_type":           fruit,
        "temperature":          temp,
        "humidity":             hum,
        "gas":                  gas,
        "storage_time":         storage_time,
        "external_temperature": ext_temp,
        "temp_delta":           temp_delta,
        "heat_load":            heat_load,
        "cooling_rate":         cooling_rate,
        "time_to_safe":         time_to_safe,
        "timestamp":            ts,
    }
    pushed = push_to_firebase(payload) if wifi_connected else False

    save_state(fruit_index, storage_time)

    fruit_label = fruit[0].upper() + fruit[1:]
    oled.fill(0)
    oled.text("FG " + fruit_label, 0, 0)
    oled.text("T:{:.1f}C H:{:.0f}%".format(temp, hum), 0, 12)
    oled.text("G:{} E:{:.1f}C".format(gas, ext_temp), 0, 24)
    oled.text("St:{}h HL:{:.0f}".format(storage_time, heat_load), 0, 36)
    oled.text(status_msg, 0, 50)
    oled.text("{}".format("OK" if pushed else "--"), 100, 50)
    oled.show()

    print("[{}] T:{} H:{} G:{} St:{}h Push:{} Status:{} WiFi:{}".format(
        fruit.upper(), temp, hum, gas, storage_time, pushed, status_msg, wifi_connected
    ))

    # Poll button every 100ms during 2s wait — never misses a press
    for _ in range(20):
        b = button.value()
        if b == 0 and last_btn == 1:
            fruit_index = (fruit_index + 1) % 2
            alert_ack   = True
            save_state(fruit_index, storage_time)
            utime.sleep_ms(300)
            last_btn = 1
        else:
            last_btn = b
        utime.sleep_ms(100)
