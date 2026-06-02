import { createContext, useContext, useState, useEffect } from "react";
import { fetchLatest } from "../api";

const FruitContext = createContext();

export function FruitProvider({ children }) {
  const [fruit, setFruit] = useState("banana");

  useEffect(() => {
    const sync = () =>
      fetchLatest()
        .then((d) => { if (d?.fruit_type) setFruit(d.fruit_type); })
        .catch(() => {});
    sync();
    const id = setInterval(sync, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <FruitContext.Provider value={{ fruit }}>
      {children}
    </FruitContext.Provider>
  );
}

export function useFruit() {
  return useContext(FruitContext);
}
