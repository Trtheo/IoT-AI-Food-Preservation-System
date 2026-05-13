import { createContext, useContext, useState } from "react";

const FruitContext = createContext();

export function FruitProvider({ children }) {
  const [fruit, setFruit] = useState("banana");
  return (
    <FruitContext.Provider value={{ fruit, setFruit }}>
      {children}
    </FruitContext.Provider>
  );
}

export function useFruit() {
  return useContext(FruitContext);
}
