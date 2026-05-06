import { useEffect, useState, useRef } from "react";
import API from "../api";
import RepoCard from "./RepoCard";
import {
  Plus,
  Search,
  BookOpen,
  Star,
  Users,
  MessageSquare,
  Layout,
  GitPullRequest,
  Settings,
  ChevronDown,
  Filter,
  Terminal,
  Cpu,
  MoreHorizontal,
  Bell,
  Code2,
  TrendingUp,
  Activity,
  History,
  ExternalLink,
  X,
  Building,
  Check
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const orgDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchRepos = async () => {
      try {
        const res = await API.get("/repo-api/user");
        setRepos(res.data);
      } catch (err) {
        console.error("Failed to fetch repos:", err);
        if (err.response?.status === 401) {
          navigate("/");
        }
      }
    };
    fetchRepos();
  }, [navigate]);

  // Close org dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target)) {
        setIsOrgDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#010409] text-[#c9d1d9] font-sans">
      {/* LEFT SIDEBAR */}
      <aside className="hidden w-72 flex-col border-r border-[#30363d] bg-[#0d1117] lg:flex">
        <div className="flex flex-col gap-6 p-4">
          {/* User Profile / Org Switcher */}
          <div className="relative" ref={orgDropdownRef}>
            <button
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#b1bac4]/10 transition-all w-full text-left"
            >
              <div className="h-5 w-5 overflow-hidden rounded-full border border-[#30363d]">
                <img src={`https://ui-avatars.com/api/?name=${user?.username || "Guest"}&background=random`} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <span className="text-sm font-semibold text-[#f0f6fc] flex-1">{user?.username || "Pallavi-Chiluveru"}</span>
              <ChevronDown className={`h-3 w-3 text-[#8b949e] transition-transform ${isOrgDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* ORG DROPDOWN MATCHING UI */}
            {isOrgDropdownOpen && (
              <div className="absolute left-2 top-10 z-50 w-72 rounded-xl border border-[#30363d] bg-[#0d1117] p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h4 className="text-sm font-bold text-[#f0f6fc]">Go to organization dashboard</h4>
                  <button onClick={() => setIsOrgDropdownOpen(false)} className="rounded-md p-1 hover:bg-[#30363d] text-[#8b949e]">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1 mb-4">
                  <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md bg-[#b1bac4]/10 text-left group">
                    <Check className="h-3.5 w-3.5 text-[#ec4899]" />
                    <div className="h-6 w-6 overflow-hidden rounded-full border border-[#30363d]">
                      <img src={`https://ui-avatars.com/api/?name=${user?.username || "Guest"}&background=random`} alt="" />
                    </div>
                    <span className="text-sm font-semibold text-[#f0f6fc]">{user?.username || "Pallavi-Chiluveru"}</span>
                  </button>

                  <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-[#b1bac4]/10 text-left group">
                    <div className="h-3.5 w-3.5"></div> {/* Placeholder for check */}
                    <div className="h-6 w-6 overflow-hidden rounded-full border border-[#30363d] bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[#f0f6fc]">mern-project-atp-22</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#30363d]">
                  <button className="flex items-center justify-center gap-2 w-full py-2 rounded-md border border-[#30363d] bg-[#21262d] text-xs font-semibold text-[#f0f6fc] hover:bg-[#30363d]">
                    <Building className="h-4 w-4" /> Manage organizations
                  </button>
                  <button
                    onClick={() => { navigate("/org"); setIsOrgDropdownOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-md border border-[#30363d] bg-[#21262d] text-xs font-semibold text-[#f0f6fc] hover:bg-[#30363d]"
                  >
                    <Plus className="h-4 w-4" /> Create organization
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Top Repositories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-[#f0f6fc]">Top repositories</h3>
              <button
                onClick={() => navigate("/create-repo")}
                className="flex items-center gap-1.5 rounded-md bg-[#238636] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#2ea043] transition-all"
              >
                <BookOpen className="h-3.5 w-3.5" />
                New
              </button>
            </div>

            <div className="px-2">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Find a repository..."
                  className="w-full rounded-md border border-[#30363d] bg-[#010409] py-1.5 pl-3 pr-3 text-xs text-[#f0f6fc] focus:border-[#ec4899] focus:outline-none focus:ring-1 focus:ring-[#ec4899] transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-0.5 overflow-y-auto max-h-[500px] custom-scrollbar">
              {filteredRepos.map((repo) => (
                <Link
                  key={repo._id}
                  to={`/repo/${repo._id}`}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-[#c9d1d9] hover:bg-[#b1bac4]/10 transition-all group"
                >
                  <div className="h-4 w-4 rounded-full bg-[#30363d] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#ec4899]"></div>
                  </div>
                  <span className="truncate">{user?.username || "Pallavi-Chiluveru"}/{repo.name}</span>
                </Link>
              ))}
              <div className="px-3 py-1 text-[11px] text-[#8b949e] hover:text-[#ec4899] cursor-pointer">Show more</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-[#010409]">
        <div className="mx-auto max-w-4xl px-8 py-8">
          <h1 className="mb-6 text-2xl font-semibold text-[#f0f6fc]">Home</h1>

          {/* AI CARD MATCHING UI */}
          <div className="mb-6 overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] shadow-sm">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-sm font-medium text-[#ec4899]">/create-issue</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#30363d] bg-[#161b22] px-4 py-2">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-[#8b949e] hover:text-[#f0f6fc]">
                  <MessageSquare className="h-4 w-4" />
                  Ask <ChevronDown className="h-3 w-3" />
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-[#8b949e] hover:text-[#f0f6fc]">
                  <Layout className="h-4 w-4" />
                  All repositories <ChevronDown className="h-3 w-3" />
                </button>
                <button className="h-6 w-6 rounded-md border border-[#30363d] flex items-center justify-center text-[#8b949e] hover:text-[#f0f6fc]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#8b949e]">Claude Haiku 4.5</span>
                <ChevronDown className="h-3 w-3 text-[#8b949e]" />
                <button className="h-7 w-7 rounded-md bg-[#21262d] flex items-center justify-center text-[#8b949e] hover:text-[#f0f6fc]">
                  <Terminal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS ROW */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#0d1117] px-4 py-1.5 text-xs font-semibold text-[#f0f6fc] hover:bg-[#21262d]">
              <Cpu className="h-4 w-4" /> Agent
            </button>
            <Link to="/new-issue" className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#0d1117] px-4 py-1.5 text-xs font-semibold text-[#f0f6fc] hover:bg-[#21262d]">
              <MessageSquare className="h-4 w-4" /> Create issue
            </Link>
            <button className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#0d1117] px-4 py-1.5 text-xs font-semibold text-[#f0f6fc] hover:bg-[#21262d]">
              <Code2 className="h-4 w-4" /> Write code <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#0d1117] px-4 py-1.5 text-xs font-semibold text-[#f0f6fc] hover:bg-[#21262d]">
              <GitPullRequest className="h-4 w-4" /> Git <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#0d1117] px-4 py-1.5 text-xs font-semibold text-[#f0f6fc] hover:bg-[#21262d]">
              <Users className="h-4 w-4" /> Pull requests
            </button>
          </div>


          {/* FEED SECTION */}
          <section>
            <div className="mb-4 flex items-center justify-between border-b border-[#30363d] pb-2">
              <h2 className="text-sm font-semibold text-[#f0f6fc]">Feed</h2>
              <button className="flex items-center gap-1.5 rounded-md bg-[#21262d] border border-[#30363d] px-2 py-1 text-xs font-semibold text-[#f0f6fc] hover:bg-[#30363d]">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
            </div>

            <div className="space-y-6">

              {/* REAL REPOS LIST */}
              {repos.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {repos.slice(0, 3).map(repo => (
                    <RepoCard key={repo._id} repo={repo} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Footer Match */}
          <footer className="mt-20 border-t border-[#30363d] py-10">
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#8b949e]">
              <Code2 className="h-5 w-5 opacity-50" />
              <span>© 2026 GitHub, Inc.</span>
              <span className="hover:text-[#ec4899] cursor-pointer">Terms</span>
              <span className="hover:text-[#ec4899] cursor-pointer">Privacy</span>
              <span className="hover:text-[#ec4899] cursor-pointer">Security</span>
              <span className="hover:text-[#ec4899] cursor-pointer">Status</span>
              <span className="hover:text-[#ec4899] cursor-pointer">Docs</span>
              <span className="hover:text-[#ec4899] cursor-pointer">Contact</span>
              <span className="hover:text-[#ec4899] cursor-pointer">Manage cookies</span>
            </div>
          </footer>
        </div>
      </main>

      {/* RIGHT SIDEBAR - CHANGELOG */}
      <aside className="hidden w-80 flex-col border-l border-[#30363d] bg-[#0d1117] p-6 xl:flex">
        <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4 shadow-sm">
          <h3 className="text-xs font-bold text-[#f0f6fc] mb-4">Latest from our changelog</h3>
          <ul className="space-y-6">
            <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-[#8b949e]">
              <span className="text-[11px] text-[#8b949e]">15 hours ago</span>
              <p className="mt-1 text-xs font-medium text-[#f0f6fc] hover:text-[#ec4899] cursor-pointer leading-snug">
                Secret scanning with GitHub MCP Server is now generally available
              </p>
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-[#8b949e]">
              <span className="text-[11px] text-[#8b949e]">16 hours ago</span>
              <p className="mt-1 text-xs font-medium text-[#f0f6fc] hover:text-[#ec4899] cursor-pointer leading-snug">
                Dependency scanning with GitHub MCP Server is in public preview
              </p>
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-[#8b949e]">
              <span className="text-[11px] text-[#8b949e]">Yesterday</span>
              <p className="mt-1 text-xs font-medium text-[#f0f6fc] hover:text-[#ec4899] cursor-pointer leading-snug">
                Code to cloud risk visibility with Microsoft Defender for Cloud is now...
              </p>
            </li>
            <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-[#8b949e]">
              <span className="text-[11px] text-[#8b949e]">Yesterday</span>
              <p className="mt-1 text-xs font-medium text-[#f0f6fc] hover:text-[#ec4899] cursor-pointer leading-snug">
                Deprecation notice: code_scanning_upload field will be...
              </p>
            </li>
          </ul>
          <button className="mt-6 text-xs font-semibold text-[#8b949e] hover:text-[#ec4899] transition-all">
            View changelog →
          </button>
        </div>
      </aside>
    </div>
  );
}
