import { useCallback, useState, useEffect } from "react";
import {
  Brain, RefreshCw, CheckCircle, AlertTriangle,
  XCircle, Clock, Percent, FlaskConical, Timer, BarChart2,
} from "lucide-react";
import { fetchPrediction, manualPredict, fetchFeatureImportance } from "../api";
import { useFetch } from "../hooks/useFetch";
import { useFruit } from "../context/FruitContext";
import Loader from "../components/Loader";

const RISK_STYLES = {
  Low:    "bg-green-100 text-green-800 border-green-300",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  High:   "bg-red-100 text-red-800 border-red-300",
};
const CONDITION_ICON = {
  Fresh:    <CheckCircle size={36} className="text-green-500" />,
  Ripening: <AlertTriangle size={36} className="text-yellow-500" />,
  Spoiling: <XCircle size={36} className="text-red-500" />,
};
const BAR_COLOR = {
  Fresh:    "bg-green-500",
  Ripening: "bg-yellow-400",
  Spoiling: "bg-red-500",
};

const FORM_DEFAULTS = {
  banana: { temperature: 14, humidity: 88, gas: 120, storage_time: 24, temp_delta: 6 },
  tomato: { temperature: 13, humidity: 87, gas: 110, storage_time: 36, temp_delta: 5 },
};

function ResultCard({ data }) {
  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          {CONDITION_ICON[data.condition]}
          <div>
            <p className="text-sm text-gray-500">
              Fruit Condition
              {data.fruit_type && (
                <span className="ml-2 capitalize text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {data.fruit_type}
                </span>
              )}
            </p>
            <p className="text-2xl font-bold text-gray-800">{data.condition}</p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1.5 border rounded-full px-4 py-1 text-sm font-semibold mb-5 ${RISK_STYLES[data.risk_level]}`}>
          <AlertTriangle size={13} /> Risk: {data.risk_level}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-1"><Clock size={16} className="text-gray-400" /></div>
            <p className="text-xs text-gray-500 mb-1">Shelf Life</p>
            <p className="text-lg font-bold text-gray-800">{data.shelf_life}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-1"><Percent size={16} className="text-gray-400" /></div>
            <p className="text-xs text-gray-500 mb-1">Confidence</p>
            <p className="text-lg font-bold text-gray-800">{data.confidence}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-1"><Timer size={16} className="text-gray-400" /></div>
            <p className="text-xs text-gray-500 mb-1">Storage Time</p>
            <p className="text-lg font-bold text-gray-800">
              {data.storage_time !== undefined ? `${data.storage_time}h` : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="font-semibold text-gray-700 mb-3">Probability Breakdown</h2>
        {Object.entries(data.probabilities).map(([cls, pct]) => (
          <div key={cls} className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{cls}</span><span>{pct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${BAR_COLOR[cls]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ManualForm({ fruit }) {
  const [form, setForm]       = useState({ ...FORM_DEFAULTS[fruit] || FORM_DEFAULTS.banana });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Reset form and result when fruit changes in navbar
  useEffect(() => {
    setForm({ ...(FORM_DEFAULTS[fruit] || FORM_DEFAULTS.banana) });
    setResult(null);
    setError(null);
  }, [fruit]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: parseFloat(e.target.value) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await manualPredict({ fruit_type: fruit, ...form });
      setResult({ ...res, storage_time: form.storage_time });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "temperature",  label: "Temperature",         unit: "°C",  min: -5, max: 40,  step: 0.1 },
    { name: "humidity",     label: "Humidity",            unit: "%",   min: 0,  max: 100, step: 0.1 },
    { name: "gas",          label: "Gas Level",           unit: "ppm", min: 0,  max: 500, step: 1   },
    { name: "storage_time", label: "Storage Time",        unit: "hrs", min: 0,  max: 300, step: 1   },
    { name: "temp_delta",   label: "Temp Delta (ext-int)", unit: "°C", min: 0,  max: 20,  step: 0.1 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <FlaskConical size={18} className="text-green-700" />
        <h2 className="font-semibold text-gray-700">Manual Prediction</h2>
        <span className="ml-auto text-xs capitalize bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          {fruit}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-4">
        {fields.map(({ name, label, unit, min, max, step }) => (
          <div key={name}>
            <label className="text-xs text-gray-500 mb-1 block">
              {label} <span className="text-gray-400">({unit})</span>
            </label>
            <input
              type="number"
              name={name}
              value={form[name]}
              onChange={handleChange}
              min={min}
              max={max}
              step={step}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        ))}
        <div className="col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Predicting..." : "Run Prediction"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {result && <ResultCard data={result} />}
    </div>
  );
}

const FEATURE_COLORS = {
  temperature:  "#f97316",
  humidity:     "#3b82f6",
  gas:          "#8b5cf6",
  storage_time: "#14b8a6",
  fruit_type:   "#22c55e",
  temp_delta:   "#f59e0b",
};

function FeatureImportanceCard() {
  const fn = useCallback(() => fetchFeatureImportance(), []);
  const { data, loading, error } = useFetch(fn);

  if (loading) return (
    <div className="bg-white rounded-2xl shadow p-5 mt-4">
      <p className="text-sm text-gray-400">Loading feature importance...</p>
    </div>
  );

  if (error || !data) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-5 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={18} className="text-green-700" />
        <h2 className="font-semibold text-gray-700">Model Feature Importance</h2>
      </div>
      {data.features.map(({ name, importance }) => (
        <div key={name} className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span className="capitalize">{name.replace("_", " ")}</span>
            <span>{importance}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${importance}%`, backgroundColor: FEATURE_COLORS[name] ?? "#64748b" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Prediction() {
  const { fruit } = useFruit();
  const [mode, setMode] = useState("live");

  const fn = useCallback(() => fetchPrediction(fruit), [fruit]);
  const { data: raw, loading, refreshing, error, refetch } = useFetch(fn, 2000);

  if (loading && mode === "live") return <Loader />;

  if (!raw && mode === "live") return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain size={22} className="text-green-700" />
        <h1 className="text-2xl font-bold text-green-800">Spoilage Prediction</h1>
      </div>
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl px-4 py-6 flex items-center gap-3">
        <AlertTriangle size={20} />
        <div>
          <p className="font-semibold">Backend not reachable</p>
          <p className="text-sm mt-0.5">{error ?? "Start the backend or switch to Manual mode."}</p>
        </div>
      </div>
    </div>
  );

  const data = raw;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain size={22} className="text-green-700" />
          <h1 className="text-2xl font-bold text-green-800">Spoilage Prediction</h1>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
          {["live", "manual", "model"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-all ${
                mode === m ? "bg-white text-green-800 shadow" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "live" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={refetch}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-60"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <ResultCard data={data} />
        </>
      )}

      {mode === "manual" && <ManualForm fruit={fruit} />}

      {mode === "model" && <FeatureImportanceCard />}
    </div>
  );
}
