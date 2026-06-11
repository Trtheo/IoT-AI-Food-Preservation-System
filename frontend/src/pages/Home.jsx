import { useCallback, useState, useEffect } from "react";
import { Thermometer, Droplets, Wind, AlertTriangle, Wifi, Flame, Clock, Zap, Activity } from "lucide-react";
import { fetchLatest } from "../api";
import { useFetch } from "../hooks/useFetch";
import { useFruit } from "../context/FruitContext";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";

// Heat thresholds — temperature used only as heat indicator
const THRESHOLDS = {
  banana: { temperature: { min: 13, max: 19 }, humidity: { min: 80, max: 95 }, gas: { max: 220 }, heat_load: 300, conduction: 0.6 },
  tomato: { temperature: { min: 10, max: 20 }, humidity: { min: 80, max: 93 }, gas: { max: 220 }, heat_load: 250, conduction: 0.5 },
};

function isUnsafe(data, fruit) {
  const t = THRESHOLDS[fruit] || THRESHOLDS.banana;
  return (
    data.temperature < (t.temperature.min ?? -Infinity) ||
    data.temperature > t.temperature.max ||
    data.humidity > t.humidity.max ||
    data.gas > t.gas.max ||
    (data.heat_load ?? 0) > t.heat_load ||
    (data.conduction ?? 0) > t.conduction ||
    (data.cop ?? 99) < 1.0
  );
}

function getUnsafeReason(data, fruit, t) {
  // Heat-first priority
  if ((data.heat_load ?? 0) > t.heat_load)
    return `Excess heat absorbed: ${data.heat_load} kJ/kg — thermal damage threshold exceeded`;
  if ((data.conduction ?? 0) > t.conduction)
    return `Heat leaking through walls: ${data.conduction} W/m²K — external heat conducting into storage`;
  if ((data.cop ?? 99) < 1.0)
    return `Cooling losing heat battle: COP ${data.cop} — heat removal rate insufficient`;
  // Temperature as heat symptom
  if (fruit === "tomato" && data.temperature < 10)
    return "Chilling injury — heat removed too aggressively, tomato below 10°C";
  if (data.temperature < t.temperature.min)
    return `Insufficient heat removed: ${data.temperature}°C below safe range (min ${t.temperature.min}°C)`;
  if (data.temperature > t.temperature.max)
    return `Excess heat in storage: ${data.temperature}°C — accelerating spoilage (max ${t.temperature.max}°C)`;
  if (data.humidity > t.humidity.max)
    return `High humidity: ${data.humidity}% — moisture amplifying heat damage (max ${t.humidity.max}%)`;
  if (data.gas > t.gas.max)
    return `Elevated gas: ${data.gas} ppm — heat-driven ethylene production (max ${t.gas.max} ppm)`;
  return `Heat conditions out of safe range for ${fruit}`;
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
          {`Sensor live — updated ${secondsAgo}s ago`}
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
          <span className="font-medium text-sm">Heat levels safe — {activeFruit} storage conditions optimal</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Temperature" value={data.temperature} unit="°C" icon={Thermometer}
          color={cardColor(data.temperature, t.temperature.min, t.temperature.max) ?? "bg-green-600"} />
        <StatCard label="Humidity" value={data.humidity} unit="%" icon={Droplets}
          color={cardColor(data.humidity, t.humidity.min, t.humidity.max) ?? "bg-blue-600"} />
        <StatCard label="Gas Level" value={data.gas} unit="ppm" icon={Wind}
          color={data.gas > t.gas.max ? "bg-red-500" : "bg-purple-600"} />
        <StatCard label="Heat Load" value={data.heat_load ?? "—"} unit="kJ/kg" icon={Flame}
          color={data.heat_load > (activeFruit === "banana" ? 300 : 250) ? "bg-orange-500" : "bg-orange-400"} />
        <StatCard label="Conduction" value={data.conduction ?? "—"} unit="W/m²K" icon={Activity}
          color={data.conduction > (activeFruit === "banana" ? 0.6 : 0.5) ? "bg-red-500" : "bg-teal-600"} />
        <StatCard label="COP" value={data.cop ?? "—"} unit="" icon={Zap}
          color={data.cop < 1.0 ? "bg-red-500" : data.cop < 3.0 ? "bg-yellow-500" : "bg-green-600"} />
      </div>

      {/* Cooling recommendation */}
      {data.time_to_safe !== undefined && data.time_to_safe > 0 && (
        <div className="bg-orange-50 border border-orange-300 text-orange-800 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <Clock size={16} />
          <span className="text-sm">
            <span className="font-semibold">Heat removal estimate:</span> ~{data.time_to_safe}h to dissipate heat to safe level
            ({activeFruit === "banana" ? "14°C" : "12°C"}) · Heat removal rate: {data.cooling_rate} °C/h
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
              ["Storage Time",  `${data.storage_time ?? "-"} hrs`],
              ["External Temp", `${data.external_temperature ?? "-"} °C`],
              ["Temp Delta",    `${data.temp_delta ?? "-"} °C`],
              ["Cooling Rate",  `${data.cooling_rate ?? "-"} °C/h`],
              ["Conduction",    `${data.conduction ?? "-"} W/m²K`],
              ["COP",           data.cop ?? "-"],
              ["Last Updated",  receivedAt ? receivedAt.toLocaleString() : "-"],
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
