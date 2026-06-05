import { useCallback, useState, useEffect } from "react";
import { Thermometer, Droplets, Wind, AlertTriangle, Wifi, Flame, Clock } from "lucide-react";
import { fetchLatest } from "../api";
import { useFetch } from "../hooks/useFetch";
import { useFruit } from "../context/FruitContext";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";

const THRESHOLDS = {
  banana: { temperature: { min: 13, max: 19 }, humidity: { min: 80, max: 95 }, gas: { max: 220 } },
  tomato: { temperature: { min: 10, max: 20 }, humidity: { min: 80, max: 93 }, gas: { max: 220 } },
};

function isUnsafe(data, fruit) {
  const t = THRESHOLDS[fruit] || THRESHOLDS.banana;
  return (
    data.temperature < (t.temperature.min ?? -Infinity) ||
    data.temperature > t.temperature.max ||
    data.humidity < (t.humidity.min ?? -Infinity) ||
    data.humidity > t.humidity.max ||
    data.gas > t.gas.max
  );
}

function getUnsafeReason(data, fruit, t) {
  if (fruit === "tomato" && data.temperature < 10)
    return "Chilling injury risk - tomato below 10°C!";
  if (data.temperature < t.temperature.min)
    return `Temperature too low: ${data.temperature}°C (min ${t.temperature.min}°C)`;
  if (data.temperature > t.temperature.max)
    return `Temperature too high: ${data.temperature}°C (max ${t.temperature.max}°C)`;
  if (data.humidity > t.humidity.max)
    return `Humidity too high: ${data.humidity}% (max ${t.humidity.max}%)`;
  if (data.gas > t.gas.max)
    return `Gas level too high: ${data.gas} ppm (max ${t.gas.max} ppm)`;
  return `Warning: ${fruit} storage conditions out of range`;
}

function cardColor(value, min, max) {
  if (min !== undefined && value < min) return "bg-blue-500";
  if (value > max) return "bg-red-500";
  return null;
}

export default function Home() {
  const { fruit } = useFruit();
  const fn = useCallback(fetchLatest, []);
  const { data, loading, error } = useFetch(fn, 2000);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [receivedAt, setReceivedAt] = useState(null);

  useEffect(() => {
    if (!data) return;
    setSecondsAgo(data.last_seen_seconds ?? 0);
    setReceivedAt(new Date());
    const id = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [data]);

  if (loading) return <Loader />;

  if (!data) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl px-4 py-6 flex items-center gap-3">
        <AlertTriangle size={20} />
        <div>
          <p className="font-semibold">Backend not reachable</p>
          <p className="text-sm mt-0.5">{error ?? "Start the backend and try again."}</p>
        </div>
      </div>
    </div>
  );

  const activeFruit = data.fruit_type || fruit;
  const t      = THRESHOLDS[activeFruit] || THRESHOLDS.banana;
  const unsafe = isUnsafe(data, activeFruit);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h1 className="text-xl sm:text-2xl font-bold text-green-800">Storage Overview</h1>
        <span className="text-xs bg-green-100 text-green-800 border border-green-300 px-3 py-1 rounded-full capitalize font-medium">
          {activeFruit} {activeFruit !== fruit && <span className="text-gray-400">(sensor)</span>}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-4">Live sensor readings · auto-refreshes every 2s</p>

      {/* Sensor status badge */}
      {!data.stale && (
        <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border mb-4 bg-green-50 border-green-200 text-green-700">
          <Wifi size={15} />
          {`Sensor live - updated ${secondsAgo}s ago`}
        </div>
      )}

      {/* Safe / Unsafe banner */}
      {unsafe ? (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <AlertTriangle size={16} />
          <span className="font-medium text-sm">{getUnsafeReason(data, activeFruit, t)}</span>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <Wifi size={16} />
          <span className="font-medium text-sm">Storage conditions are safe for {activeFruit}</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Temperature" value={data.temperature} unit="°C" icon={Thermometer}
          color={cardColor(data.temperature, t.temperature.min, t.temperature.max) ?? "bg-green-600"} />
        <StatCard label="Humidity" value={data.humidity} unit="%" icon={Droplets}
          color={cardColor(data.humidity, t.humidity.min, t.humidity.max) ?? "bg-blue-600"} />
        <StatCard label="Gas Level" value={data.gas} unit="ppm" icon={Wind}
          color={data.gas > t.gas.max ? "bg-red-500" : "bg-purple-600"} />
        <StatCard label="Heat Load" value={data.heat_load ?? "—"} unit="kJ/kg" icon={Flame}
          color={data.heat_load > (activeFruit === "banana" ? 300 : 250) ? "bg-orange-500" : "bg-orange-400"} />
      </div>

      {/* Cooling recommendation (Newton's Law) */}
      {data.time_to_safe !== undefined && data.time_to_safe > 0 && (
        <div className="bg-orange-50 border border-orange-300 text-orange-800 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <Clock size={16} />
          <span className="text-sm">
            <span className="font-semibold">Cooling estimate:</span> ~{data.time_to_safe}h to reach safe storage temp
            ({activeFruit === "banana" ? "14°C" : "12°C"}) · Cooling rate: {data.cooling_rate} °C/h
          </span>
        </div>
      )}

      {/* Details table */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-5">
        <h2 className="font-semibold text-gray-700 mb-3">Details</h2>
        <table className="w-full text-sm text-gray-600">
          <tbody>
            {[
              ["Fruit Type",    (data.fruit_type ?? "-").charAt(0).toUpperCase() + (data.fruit_type ?? "").slice(1)],
              ["Storage Time", `${data.storage_time ?? "-"} hrs`],
              ["External Temp", `${data.external_temperature ?? "-"} °C`],
              ["Temp Delta",    `${data.temp_delta ?? "-"} °C`],
              ["Last Updated", receivedAt ? receivedAt.toLocaleString() : "-"],
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
