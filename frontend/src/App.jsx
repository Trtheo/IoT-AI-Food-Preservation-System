import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Graphs from "./pages/Graphs";
import Prediction from "./pages/Prediction";
import Alerts from "./pages/Alerts";
import { FruitProvider } from "./context/FruitContext";

export default function App() {
  return (
    <FruitProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/graphs" element={<Graphs />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/alerts" element={<Alerts />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FruitProvider>
  );
}
