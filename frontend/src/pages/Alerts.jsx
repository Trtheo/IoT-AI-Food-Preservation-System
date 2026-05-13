import { useCallback, useState, useEffect } from "react";
import { Bell, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { fetchAlerts } from "../api";
import { useFetch } from "../hooks/useFetch";
import { useFruit } from "../context/FruitContext";
import Loader from "../components/Loader";

const LIMITS    = [50, 100, 200];
const PAGE_SIZE = 10;

export default function Alerts() {
  const { fruit } = useFruit();
  const [limit, setLimit]           = useState(100);
  const [filterFruit, setFilterFruit] = useState(fruit);
  const [page, setPage]             = useState(1);

  // Sync filter with navbar fruit selector
  useEffect(() => {
    setFilterFruit(fruit);
    setPage(1);
  }, [fruit]);

  const fn = useCallback(() => fetchAlerts(limit), [limit]);
  const { data, loading, refreshing, error, refetch } = useFetch(fn, 10000);

  if (loading) return <Loader />;

  const allAlerts = data ?? [];
  const isDemo    = !data;

  // Filter by fruit
  const filtered = filterFruit === "all"
    ? allAlerts
    : allAlerts.filter((a) => a.fruit_type === filterFruit);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleLimitChange = (l) => { setLimit(l); setPage(1); };
  const handleFilterChange = (f) => { setFilterFruit(f); setPage(1); };

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={22} className="text-green-700" />
          <h1 className="text-2xl font-bold text-green-800">Alerts</h1>
          {filtered.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">
              {filtered.length} total
            </span>
          )}
        </div>
        <button
          onClick={refetch}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Fruit filter */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {["all", "banana", "tomato"].map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-all ${
                filterFruit === f
                  ? "bg-white text-green-800 shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Limit selector */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-gray-400 mr-1">Show last</span>
          {LIMITS.map((l) => (
            <button
              key={l}
              onClick={() => handleLimitChange(l)}
              className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all ${
                limit === l
                  ? "bg-green-700 text-white border-green-700"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Demo banner */}
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm">
          <AlertTriangle size={15} />
          <span>Backend not reachable. {error && `(${error})`}</span>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <CheckCircle size={40} className="text-green-400 mx-auto mb-2" />
          <p className="text-green-700 font-medium">No alerts found</p>
          <p className="text-green-500 text-sm mt-1">
            {filterFruit !== "all" ? `No alerts for ${filterFruit}` : "All conditions are safe"}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-5">
            {paged.map((alert, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={15} className="text-red-500" />
                  <span className="text-xs text-gray-400">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                  {alert.fruit_type && (
                    <span className="ml-auto text-xs capitalize bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {alert.fruit_type}
                    </span>
                  )}
                </div>
                <ul className="text-sm text-red-700 space-y-1 pl-1">
                  {alert.messages.map((msg, j) => (
                    <li key={j} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    p === safePage
                      ? "bg-green-700 text-white border-green-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
