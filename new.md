question 1. 
"which fruit is this predicting for?" and the system has no answer. The ML model was trained on generic ranges — not banana-specific or tomato-specific ranges.

question 2.
"what is the predicted weight of this fruit?" and the system has no answer. The ML model was trained on generic ranges — not specific weight predictions for individual fruits.

question 3.
"what is the predicted color of this fruit?" and the system has no answer. The ML model was trained on generic ranges — not specific color predictions for individual fruits.

question 4.
"what is the predicted ripeness of this fruit?" and the system has no answer. The ML model was trained on generic ranges — not specific ripeness predictions for individual fruits.

question 5.
"what is the predicted size of this fruit?" and the system has no answer. The ML model was trained on generic ranges — not specific size predictions for individual fruits.

question 6.
"what is the predicted sweetness of this fruit?" and the system has no answer. The ML model was trained on generic ranges — not specific sweetness predictions for individual fruits.

question 7.
"what is the predicted acidity of this fruit?" and the system has no answer. The ML model was trained on generic ranges — not specific acidity predictions for individual fruits.


question 8.
"what is the predicted shelf life of this fruit?" and the system has no answer. The ML model was trained on generic ranges — not specific shelf life predictions for individual fruits.

question 9.

"what is the predicted nutritional content of this fruit?" and the system has no answer. The ML model was trained on generic ranges — not specific nutritional content predictions for individual fruits.

question 10
Stale data is served silently as live data
If the ESP32/simulator stops, the backend keeps returning the last Firebase reading with no warning. The frontend shows it as current. There is zero staleness detection on timestamp. This is a demo-killer — the dashboard will show "Fresh" confidently while the sensor has been dead for hours.

question 11
flask-cors was missing from ml/requirements.txt
(Already fixed in the previous session, but worth noting — app.py would crash on startup without it.)

question 12
Firebase credentials were missing from ml/requirements.txt
(Already fixed in the previous session, but worth noting — app.py would crash on startup without it.)

question 13
🟠 Functional Gaps (Missing Features That Should Exist)
5. No per-fruit thresholds
The backend has one hardcoded set of thresholds:

temperature: 20, humidity: 80, gas: 200

Copy
js
These are wrong for both banana (safe at 13–15°C, so 20°C is already spoiling) and tomato (chilling injury below 10°C is not detected at all). There are no lower-bound checks anywhere.

6. No input validation on the ML endpoint
ml/app.py does data["temperature"] directly with no validation. If any field is missing, null, or a string, it crashes with a 500 error and the entire prediction page breaks. There is no try/except around the prediction logic.

7. No manual prediction form
The /prediction page only predicts from the latest live sensor reading. There is no way to type in values manually and get a prediction — which is critical for demos when sensors aren't working, and for showing supervisors how the model responds to different inputs.

8. getAlerts only looks at the last 20 readings

db.ref("sensor_data").limitToLast(20)

Copy
js
The alerts page will miss older alerts. There's no pagination, no date filter, and no way to see the full alert history.

9. No fruit_type in the simulator or Firebase data
The data structure pushed to Firebase has no fruit_type field. You can't distinguish banana readings from tomato readings in the database.

10. storage_time has no real origin
The simulator starts storage_time at 0 every time it runs. There's no way to set a start date or carry over storage time between simulator restarts. Every restart resets the fruit to "just placed in storage."

🟡 Logic / Biological Errors
11. external_temperature is not used meaningfully
The simulator just adds 4–8°C to internal temp. The ML model takes it as a raw feature. But the biologically meaningful value is the delta (external_temp - internal_temp), which indicates condensation risk. Neither the training data nor the model captures this correctly.

12. ML training data has no fruit-type separation
train.py generates one pool of 500 samples with generic ranges. There are no banana-specific or tomato-specific samples. The model cannot distinguish between a banana at 14°C (perfectly fine) and a tomato at 14°C (also fine but for different biological reasons).

13. No lower-bound temperature alert
Tomatoes suffer chilling injury below 10°C — this is never detected. The system only checks temperature > 20, so a tomato stored at 5°C would show as "safe" on every page.

14. debug=True in production ML service

app.run(port=5001, debug=True)

Copy
python
The scanner flagged this. Debug mode exposes an interactive debugger over HTTP — anyone who can reach port 5001 can execute arbitrary Python code on your machine.

🔵 Missing Pages / UI
15. No fruit selector on the frontend
No dropdown or toggle to switch between Banana and Tomato. Without this, per-fruit thresholds and per-fruit shelf life estimates are impossible to display.

16. No sensor status indicator
No "last updated X seconds ago" or "sensor offline" badge anywhere on the dashboard. The Home page shows live readings but gives no indication of when they were last received.

17. No manual prediction input form
Covered above (#7) but worth repeating as a UI gap — the Prediction page has no form, only auto-fetched data.

