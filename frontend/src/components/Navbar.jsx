import { Link, useNavigate } from "react-router-dom";
import { 
  Code2, 
  Search, 
  Plus, 
  Bell, 
  Inbox, 
  LogOut, 
  Menu,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#30363d] bg-[#010409] px-4 md:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="rounded-md p-1 hover:bg-[#21262d] md:hidden">
          <Menu className="h-5 w-5 text-[#8b949e]" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
             <Code2 className="h-6 w-6 text-black" />
          </div>
          <span className="hidden text-sm font-semibold text-white md:block">Dashboard</span>
        </Link>
      </div>

      {/* Center Search (matches screenshot layout where search is on right/center) */}
      <div className="mx-4 flex-1 max-w-lg">
        <div className="relative group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-[#8b949e] group-focus-within:text-[#1f6feb]" />
          </div>
          <input
            type="text"
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] py-1.5 pl-10 pr-3 text-sm text-[#e6edf3] placeholder-[#8b949e] transition-all focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
            placeholder="Type / to search"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {token ? (
          <>
            <button className="hidden rounded-md border border-[#30363d] p-1.5 text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3] lg:flex">
              <Plus className="h-4 w-4" />
              <ChevronDown className="ml-1 h-3 w-3" />
            </button>
            <button className="rounded-md border border-[#30363d] p-1.5 text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]">
              <Inbox className="h-4 w-4" />
            </button>
            <button className="rounded-md border border-[#30363d] p-1.5 text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]">
              <Bell className="h-4 w-4" />
            </button>
            
            <div className="h-4 w-[1px] bg-[#30363d] mx-1"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md p-1 hover:bg-[#21262d]"
            >
               <div className="h-6 w-6 overflow-hidden rounded-full bg-slate-700">
                  <img src={`https://ui-avatars.com/api/?name=${user?.username || "Guest"}&background=random`} alt="User" />
               </div>
               <LogOut className="h-4 w-4 text-[#8b949e] hover:text-red-400" />
            </button>
          </>
        ) : (
          <Link 
            to="/" 
            className="rounded-md bg-[#238636] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2ea043]"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}