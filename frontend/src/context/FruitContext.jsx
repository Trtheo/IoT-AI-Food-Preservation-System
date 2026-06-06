import { createContext, useContext, useState, useEffect } from "react";
import { fetchLatest } from "../api";

const FruitContext = createContext();

export function FruitProvider({ children }) {
  const [fruit, setFruit] = useState("banana");
  const [manualFruit, setManualFruit] = useState(null);

  useEffect(() => {
    const sync = () =>
      fetchLatest()
        .then((d) => { if (d?.fruit_type && !manualFruit) setFruit(d.fruit_type); })
        .catch(() => {});
    sync();
    const id = setInterval(sync, 2000);
    return () => clearInterval(id);
  }, [manualFruit]);

  const toggleFruit = () => {
    const next = fruit === "banana" ? "tomato" : "banana";
    // If already manual, toggling back to original re-enables auto-sync
    if (manualFruit && next !== manualFruit) {
      setManualFruit(null);
    } else {
      setManualFruit(next);
    }
    setFruit(next);
  };

  return (
    <FruitContext.Provider value={{ fruit, toggleFruit, isManual: !!manualFruit }}>
      {children}
    </FruitContext.Provider>
  );
}

export function useFruit() {
  return useContext(FruitContext);
}
