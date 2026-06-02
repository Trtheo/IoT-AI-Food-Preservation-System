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
    <nav className="bg-green-800 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-base md:text-lg tracking-wide">
          <Leaf size={20} className="text-green-300" />
          <span className="hidden sm:inline">FreshGuard IoT</span>
          <span className="sm:hidden">FreshGuard</span>
        </div>

        <div className="flex gap-1 sm:gap-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 text-xs sm:text-sm font-medium transition-colors px-2 py-1 rounded-lg ${
                  isActive ? "text-green-300 bg-green-900" : "hover:text-green-300 hover:bg-green-900"
                }`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="bg-green-900 rounded-xl px-3 py-1">
          <span className="text-xs sm:text-sm font-medium capitalize text-white">{fruit}</span>
        </div>
      </div>
    </nav>
  );
}
