import { NavLink } from "react-router-dom";
import { Home, BarChart2, Brain, Bell, Leaf } from "lucide-react";
import { useFruit } from "../context/FruitContext";

const links = [
  { to: "/",           label: "Home",       icon: Home      },
  { to: "/graphs",     label: "Graphs",     icon: BarChart2 },
  { to: "/prediction", label: "Prediction", icon: Brain     },
  { to: "/alerts",     label: "Alerts",     icon: Bell      },
];

export default function Navbar() {
  const { fruit } = useFruit();

  return (
    <nav className="bg-green-800 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2 font-bold text-lg tracking-wide">
        <Leaf size={20} className="text-green-300" />
        FreshGuard IoT
      </div>

      <div className="flex gap-6">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive ? "text-green-300 underline" : "hover:text-green-300"
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </div>

      {/* Fruit badge - reflects ESP32 button selection */}
      <div className="bg-green-900 rounded-xl px-4 py-1.5">
        <span className="text-sm font-medium capitalize text-white">{fruit}</span>
      </div>
    </nav>
  );
}
