import { useCallback, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "hammerjs";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import { Thermometer, Droplets, Wind, ZoomIn, AlertTriangle, Waves, Flame } from "lucide-react";
import { fetchHistory } from "../api";
import { useFetch } from "../hooks/useFetch";
import { useFruit } from "../context/FruitContext";
import Loader from "../components/Loader";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, zoomPlugin
);

const LIMITS = [20, 50, 100];

// Per-fruit thresholds matching sensorController.js
const FRUIT_THRESHOLDS = {
  banana: { temperature: { min: 13, max: 19 }, humidity: { max: 95 }, gas: { max: 220 }, temp_delta: { max: 10 } },
  tomato: { temperature: { min: 10, max: 20 }, humidity: { max: 93 }, gas: { max: 220 }, temp_delta: { max: 10 } },
};

function getMetrics(fruit) {
  const t = FRUIT_THRESHOLDS[fruit] || FRUIT_THRESHOLDS.banana;
  const heatMax = fruit === "tomato" ? 250 : 300;
  return [
    {
      key: "temperature", label: "Temperature", unit: "°C",
      color: "#f97316", icon: Thermometer,
      thresholdMax: t.temperature.max,
      thresholdMin: t.temperature.min,
    },
    {
      key: "humidity", label: "Humidity", unit: "%",
      color: "#3b82f6", icon: Droplets,
      thresholdMax: t.humidity.max,
      thresholdMin: undefined,
    },
    {
      key: "gas", label: "Gas Level", unit: "ppm",
      color: "#8b5cf6", icon: Wind,
      thresholdMax: t.gas.max,
      thresholdMin: undefined,
    },
    {
      key: "temp_delta", label: "Temp Delta (ext-int)", unit: "°C",
      color: "#14b8a6", icon: Waves,
      thresholdMax: t.temp_delta.max,
      thresholdMin: undefined,
    },
    {
      key: "heat_load", label: "Heat Load", unit: "kJ/kg",
      color: "#ef4444", icon: Flame,
      thresholdMax: heatMax,
      thresholdMin: undefined,
    },
  ];
}

function SummaryBadge({ label, value, unit, color }) {
  return (
    <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-100">
      <span className="text-xs text-gray-400 mb-0.5">{label}</span>
      <span className="font-bold text-sm" style={{ color }}>{value}{unit}</span>
    </div>
  );
}

function MetricChart({ metric, records, chartRef }) {
  const Icon    = metric.icon;
  const values  = records.map((r) => +r[metric.key]).filter((v) => !isNaN(v));
  if (!values.length) return null;

  const avg    = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const min    = Math.min(...values).toFixed(1);
  const max    = Math.max(...values).toFixed(1);
  const latest = values[values.length - 1]?.toFixed(1);

  const overMax = metric.thresholdMax !== undefined
    ? values.filter((v) => v > metric.thresholdMax).length : 0;
  const underMin = metric.thresholdMin !== undefined
    ? values.filter((v) => v < metric.thresholdMin).length : 0;

  const chartData = {
    labels: records.map((r) => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [{
      label: `${metric.label} (${metric.unit})`,
      data: values,
      borderColor: metric.color,
      backgroundColor: (ctx) => {
        const { ctx: c, chartArea } = ctx.chart;
        if (!chartArea) return metric.color + "20";
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, metric.color + "55");
        g.addColorStop(1, metric.color + "00");
        return g;
      },
      borderWidth: 2.5,
      pointRadius: records.length > 40 ? 0 : 3,
      pointHoverRadius: 6,
      pointBackgroundColor: metric.color,
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      tension: 0.4,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#94a3b8",
        bodyColor: "#f1f5f9",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} ${metric.unit}`,
          afterLabel: (ctx) => {
            const v = ctx.parsed.y;
            if (metric.thresholdMax !== undefined && v > metric.thresholdMax)
              return ` Above max (${metric.thresholdMax}${metric.unit})`;
            if (metric.thresholdMin !== undefined && v < metric.thresholdMin)
              return ` Below min (${metric.thresholdMin}${metric.unit})`;
            return " Safe";
          },
        },
      },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { maxTicksLimit: 8, color: "#94a3b8", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { color: "#94a3b8", font: { size: 11 } },
        suggestedMin: Math.min(...values) * 0.97,
        suggestedMax: Math.max(...values) * 1.03,
      },
    },
  };

  const hasAlert = overMax > 0 || underMin > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl" style={{ backgroundColor: metric.color + "18" }}>
            <Icon size={18} style={{ color: metric.color }} />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{metric.label}</p>
            <p className="text-xs text-gray-400">
              {metric.thresholdMin !== undefined && `Min: ${metric.thresholdMin}${metric.unit}  `}
              {metric.thresholdMax !== undefined && `Max: ${metric.thresholdMax}${metric.unit}`}
            </p>
          </div>
        </div>
        {hasAlert && (
          <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-full">
            {overMax > 0  && `${overMax} above max`}
            {overMax > 0 && underMin > 0 && "  "}
            {underMin > 0 && `${underMin} below min`}
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <SummaryBadge label="Latest" value={latest} unit={metric.unit} color={metric.color} />
        <SummaryBadge label="Avg"    value={avg}    unit={metric.unit} color="#64748b" />
        <SummaryBadge label="Min"    value={min}    unit={metric.unit} color="#22c55e" />
        <SummaryBadge label="Max"    value={max}    unit={metric.unit} color="#ef4444" />
      </div>

      <Line ref={chartRef} data={chartData} options={options} />

      <div className="flex justify-end mt-2">
        <button
          onClick={() => chartRef?.current?.resetZoom()}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ZoomIn size={13} /> Reset Zoom
        </button>
      </div>
    </div>
  );
}

export default function Graphs() {
  const { fruit } = useFruit();
  const [limit, setLimit] = useState(50);

  const fn = useCallback(() => fetchHistory(limit), [limit]);
  const { data: raw, loading, error } = useFetch(fn, 2000);

  const ref0 = useRef();
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const refs = [ref0, ref1, ref2, ref3, ref4];

  const metrics = getMetrics(fruit);

  if (loading) return <Loader />;

  if (!raw?.length) return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Historical Trends</h1>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-6 flex items-center gap-3">
        <AlertTriangle size={20} />
        <div>
          <p className="font-semibold">No data available</p>
          <p className="text-sm mt-0.5">{error ?? "Start the simulator or ESP32 to collect readings."}</p>
        </div>
      </div>
    </div>
  );

  const records = raw.filter((r) => !r.fruit_type || r.fruit_type === fruit);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-green-800">Historical Trends</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {records.length} readings for {fruit} · scroll to zoom · drag to pan
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs capitalize bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium">
            {fruit}
          </span>
          <div className="flex gap-1 sm:gap-2">
            {LIMITS.map((l) => (
              <button
                key={l}
                onClick={() => setLimit(l)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                  limit === l
                    ? "bg-green-700 text-white border-green-700 shadow-sm"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                Last {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {records.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
          <AlertTriangle size={15} /> No {fruit} readings found in the last {limit} records.
        </div>
      )}

      <div className="flex flex-col gap-6">
        {metrics.map((metric, i) => {
          const ref = refs[i];
          return <MetricChart key={metric.key} metric={metric} records={records} chartRef={ref} />;
        })}
      </div>
    </div>
  );
}
