# Running FreshGuard

Open **4 terminals** in the project root and run in this order.

---

### Terminal 1 — ML Service
```bash
cd ml
pip install -r requirements.txt
python train.py
python app.py
```
> `train.py` only needs to run once. Skip it if `model.pkl` already exists.

---

### Terminal 2 — Backend
```bash
cd backend
npm install
npm run dev
```

---

### Terminal 3 — Frontend
```bash
cd frontend
npm install
npm run dev
```
> Open http://localhost:5173

---

### Terminal 4 — Simulator
```bash
cd simulator
pip install -r requirements.txt
python simulate.py
```
> Choose `1` for Banana or `2` for Tomato when prompted.
