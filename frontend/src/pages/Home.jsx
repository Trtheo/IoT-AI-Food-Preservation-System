import { useCallback } from "react";
import { Thermometer, Droplets, Wind, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { fetchLatest } from "../api";
import { useFetch } from "../hooks/useFetch";
import { useFruit } from "../context/FruitContext";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";

const THRESHOLDS = {
  banana: { temperature: { min: 13, max: 19 }, humidity: { min: 80, max: 95 }, gas: { max: 220 } },
  tomato: { temperature: { min: 10, max: 20 }, humidity: { min: 80, max: 93 }, gas: { max: 220 } },
};

const DEMO = {
  fruit_type: "banana",
  temperature: 14.5,
  humidity: 88,
  gas: 130,
  storage_time: 12,
  external_temperature: 20.5,
  temp_delta: 6.0,
  timestamp: Date.now(),
  stale: false,
  last_seen_seconds: 3,
};

function isUnsafe(data) {
  const t = THRESHOLDS[data.fruit_type] || THRESHOLDS.banana;
  return (
    data.temperature < (t.temperature.min ?? -Infinity) ||
    data.temperature > t.temperature.max ||
    data.humidity < (t.humidity.min ?? -Infinity) ||
    data.humidity > t.humidity.max ||
    data.gas > t.gas.max
  );
}

function cardColor(value, min, max) {
  if (min !== undefined && value < min) return "bg-blue-500";
  if (value > max) return "bg-red-500";
  return null;
}

export default function Home() {
  const { fruit } = useFruit();
  const fn = useCallback(fetchLatest, []);
  const { data: raw, loading, error } = useFetch(fn, 5000);

  if (loading) return <Loader />;

  const data   = raw ?? { ...DEMO, fruit_type: fruit };
  const isDemo = !raw;
  // Use fruit from actual sensor data, fall back to navbar selection
  const activeFruit = raw?.fruit_type || fruit;
  const t      = THRESHOLDS[activeFruit] || THRESHOLDS.banana;
  const unsafe = isUnsafe({ ...data, fruit_type: activeFruit });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-green-800">Storage Overview</h1>
        <span className="text-xs bg-green-100 text-green-800 border border-green-300 px-3 py-1 rounded-full capitalize font-medium">
          {fruit}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-4">Live sensor readings · auto-refreshes every 5s</p>

      {/* Sensor status badge */}
      {!isDemo && (
        <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border mb-4 ${
          data.stale
            ? "bg-orange-50 border-orange-300 text-orange-700"
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {data.stale ? <WifiOff size={15} /> : <Wifi size={15} />}
          {data.stale
            ? `Sensor offline — last reading was ${data.last_seen_seconds}s ago`
            : `Sensor live — updated ${data.last_seen_seconds}s ago`}
        </div>
      )}

      {/* Demo banner */}
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm">
          <AlertTriangle size={16} />
          <span>Backend not reachable — showing demo data. {error && `(${error})`}</span>
        </div>
      )}

      {/* Unsafe banner */}
      {!isDemo && unsafe && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <AlertTriangle size={16} />
          <span className="font-medium">Unsafe storage conditions detected!</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Temperature"
          value={data.temperature}
          unit="°C"
          icon={Thermometer}
          color={cardColor(data.temperature, t.temperature.min, t.temperature.max) ?? "bg-green-600"}
        />
        <StatCard
          label="Humidity"
          value={data.humidity}
          unit="%"
          icon={Droplets}
          color={cardColor(data.humidity, t.humidity.min, t.humidity.max) ?? "bg-blue-600"}
        />
        <StatCard
          label="Gas Level"
          value={data.gas}
          unit="ppm"
          icon={Wind}
          color={data.gas > t.gas.max ? "bg-red-500" : "bg-purple-600"}
        />
      </div>

      {/* Details table */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="font-semibold text-gray-700 mb-3">Details</h2>
        <table className="w-full text-sm text-gray-600">
          <tbody>
            {[
              ["Fruit Type",      (data.fruit_type ?? "—").charAt(0).toUpperCase() + (data.fruit_type ?? "").slice(1)],
              ["Storage Time",    `${data.storage_time ?? "—"} hrs`],
              ["External Temp",   `${data.external_temperature ?? "—"} °C`],
              ["Temp Delta",      `${data.temp_delta ?? "—"} °C`],
              ["Last Updated",    new Date(data.timestamp).toLocaleString()],
            ].map(([k, v]) => (
              <tr key={k} className="border-b last:border-0">
                <td className="py-2 font-medium text-gray-500">{k}</td>
                <td className="py-2 text-right">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
