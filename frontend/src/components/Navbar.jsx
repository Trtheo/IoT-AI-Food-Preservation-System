import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, BarChart2, Brain, Bell, Leaf, Menu, X } from "lucide-react";
import { useFruit } from "../context/FruitContext";

const links = [
  { to: "/",           label: "Home",       icon: Home      },
  { to: "/graphs",     label: "Graphs",     icon: BarChart2 },
  { to: "/prediction", label: "Prediction", icon: Brain     },
  { to: "/alerts",     label: "Alerts",     icon: Bell      },
];

export default function Navbar() {
  const { fruit } = useFruit();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-base tracking-wide">
          <Leaf size={20} className="text-green-300" />
          FreshGuard IoT
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded-lg transition-colors ${
                  isActive ? "text-green-300 bg-green-900" : "hover:text-green-300 hover:bg-green-900"
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-green-900 rounded-xl px-3 py-1">
            <span className="text-xs sm:text-sm font-medium capitalize">{fruit}</span>
          </div>
          <button
            className="md:hidden p-1 rounded-lg hover:bg-green-900 transition-colors"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-green-700 px-4 pb-3 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  isActive ? "text-green-300 bg-green-900" : "hover:text-green-300 hover:bg-green-900"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
