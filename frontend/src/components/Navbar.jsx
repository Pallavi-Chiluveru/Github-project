import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { 
  Code2, 
  Search, 
  Plus, 
  Bell, 
  Inbox, 
  LogOut, 
  Menu,
  ChevronDown,
  CircleDot,
  Book,
  Upload,
  Monitor,
  Building,
  Layout,
  Code,
  Box,
  Command,
  FileCode,
  GitPullRequest,
  History
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: <CircleDot size={16} />, label: "New issue", path: "/new-issue" },
    { icon: <Book size={16} />, label: "New repository", path: "/create-repo" },
    { icon: <Upload size={16} />, label: "Import repository", path: "/import" },
    { icon: <Monitor size={16} />, label: "New codespace", path: "/codespaces" },
    { icon: <Code size={16} />, label: "New gist", path: "/gist" },
    { icon: <Building size={16} />, label: "New organization", path: "/org" },
    { icon: <Layout size={16} />, label: "New project", path: "/new-project" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-4 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="rounded-md p-2 hover:bg-[#30363d] md:hidden">
          <Menu className="h-5 w-5 text-[#8b949e]" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#30363d] bg-[#010409]">
             <Layout className="h-5 w-5 text-[#f0f6fc]" />
          </div>
          <span className="hidden text-sm font-bold text-[#f0f6fc] md:block">
            Dashboard
          </span>
        </Link>
      </div>

      {/* Center Search - GitHub Style */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-[#8b949e] group-focus-within:text-[#ec4899]" />
          </div>
          <input
            type="text"
            className="w-full h-8 rounded-md border border-[#30363d] bg-[#010409] py-1 pl-10 pr-12 text-sm text-[#f0f6fc] placeholder-[#8b949e] transition-all focus:border-[#ec4899] focus:bg-[#0d1117] focus:outline-none focus:ring-1 focus:ring-[#ec4899]"
            placeholder="Type / to search"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <kbd className="hidden sm:inline-block h-5 px-1.5 rounded border border-[#30363d] bg-[#161b22] text-[10px] font-medium text-[#8b949e]">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {token ? (
          <>
            <div className="flex items-center border-r border-[#30363d] pr-2 mr-2">
              <button className="rounded-md p-2 text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
                <Box className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 inline ml-1" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 rounded-md border border-[#30363d] bg-[#21262d] px-2 py-1 text-[#8b949e] hover:bg-[#30363d] transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border border-[#30363d] bg-[#161b22] py-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                    {menuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-1.5 text-sm text-[#f0f6fc] hover:bg-[#ec4899] transition-all"
                      >
                        <span className="opacity-70">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button className="rounded-md p-2 text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
                <CircleDot className="h-4 w-4" />
              </button>
              <button className="rounded-md p-2 text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
                <GitPullRequest className="h-4 w-4" />
              </button>
              <button className="rounded-md p-2 text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
                <Inbox className="h-4 w-4" />
              </button>
              <button className="rounded-md p-2 text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
                <History className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 ml-2">
               <div className="h-7 w-7 overflow-hidden rounded-full border border-[#30363d]">
                  <img src={`https://ui-avatars.com/api/?name=${user?.username || "Guest"}&background=random`} alt="User" />
               </div>
               <button 
                onClick={handleLogout}
                className="p-1.5 text-[#8b949e] hover:text-[#f43f5e] transition-colors"
                title="Logout"
               >
                 <LogOut className="h-4 w-4" />
               </button>
            </div>
          </>
        ) : (
          <Link 
            to="/" 
            className="rounded-md bg-[#238636] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#2ea043] transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}