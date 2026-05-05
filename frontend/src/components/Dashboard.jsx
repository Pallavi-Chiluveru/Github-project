import { useEffect, useState } from "react";
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
  History,
  Terminal,
  Cpu,
  MoreHorizontal,
  Bell
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
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
        const res = await API.get("/repo");
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

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* LEFT SIDEBAR */}
      <aside className="hidden w-72 flex-col border-r border-[#30363d] bg-[#0d1117] lg:flex">
        <div className="flex flex-col gap-6 p-6">
          {/* User Profile Summary */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-700">
              <img src={`https://ui-avatars.com/api/?name=${user?.username || "Guest"}&background=random`} alt="Avatar" />
            </div>
            <span className="text-sm font-semibold text-white">{user?.username || "Loading..."}</span>
            <ChevronDown className="h-4 w-4 text-[#8b949e]" />
          </div>

          {/* Repositories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">Top Repositories</h3>
              <button 
                onClick={() => navigate("/create-repo")}
                className="flex items-center gap-1 rounded-md bg-[#238636] px-2 py-1 text-[10px] font-bold text-white hover:bg-[#2ea043]"
              >
                <Plus className="h-3 w-3" />
                New
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8b949e]" />
              <input
                type="text"
                placeholder="Find a repository..."
                className="w-full rounded-md border border-[#30363d] bg-[#010409] py-1.5 pl-9 pr-3 text-sm focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ul className="space-y-1">
              {filteredRepos.map((repo) => (
                <li key={repo._id}>
                  <Link 
                    to={`/repo/${repo._id}`}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-[#161b22]"
                  >
                    <BookOpen className="h-4 w-4 text-[#8b949e]" />
                    <span className="truncate text-[#e6edf3]">{repo.name}</span>
                  </Link>
                </li>
              ))}
              <li className="mt-4 px-2 text-xs text-[#8b949e] hover:text-[#58a6ff] cursor-pointer">
                Show more
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="mb-8 text-2xl font-semibold text-white">Home</h1>

          {/* AI / ASK BOX */}
          <div className="mb-8 rounded-xl border border-[#30363d] bg-[#161b22] p-4 shadow-sm">
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Ask anything or type @ to add context"
                className="w-full bg-transparent text-lg text-white focus:outline-none placeholder:text-[#8b949e]"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#30363d] pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-1 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium hover:bg-[#30363d]">
                  <MessageSquare className="h-4 w-4" /> Ask <ChevronDown className="h-3 w-3" />
                </button>
                <button className="flex items-center gap-1 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium hover:bg-[#30363d]">
                   All repositories <ChevronDown className="h-3 w-3" />
                </button>
                <button className="flex items-center gap-1 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium hover:bg-[#30363d]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#8b949e]">Claude Haiku 4.5</span>
                <button className="rounded-md bg-[#238636] p-1.5 text-white hover:bg-[#2ea043]">
                   <Terminal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS ROW */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
             <button className="flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#21262d] px-4 py-1.5 text-sm font-medium hover:bg-[#30363d]">
               <Cpu className="h-4 w-4" /> Agent
             </button>
             <button className="flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#21262d] px-4 py-1.5 text-sm font-medium hover:bg-[#30363d]">
               <Plus className="h-4 w-4" /> Create issue
             </button>
             <button className="flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#21262d] px-4 py-1.5 text-sm font-medium hover:bg-[#30363d]">
               <Terminal className="h-4 w-4" /> Write code <ChevronDown className="h-3 w-3" />
             </button>
             <button className="flex items-center gap-1.5 rounded-full border border-[#30363d] bg-[#21262d] px-4 py-1.5 text-sm font-medium hover:bg-[#30363d]">
               <GitPullRequest className="h-4 w-4" /> Pull requests <ChevronDown className="h-3 w-3" />
             </button>
          </div>

          {/* ANNOUNCEMENT */}
          <div className="mb-10 flex items-center justify-between rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-3">
             <div className="flex items-center gap-3">
               <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-700">
                 <Users className="h-4 w-4 text-orange-400" />
               </div>
               <p className="text-sm font-medium">You've been added to the <span className="font-bold">mern-project-atp-22</span> organization.</p>
             </div>
             <div className="flex items-center gap-3">
               <button className="rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs font-semibold hover:bg-[#30363d]">View organization</button>
               <button className="text-[#8b949e] hover:text-white">✕</button>
             </div>
          </div>

          {/* FEED SECTION */}
          <section>
            <div className="mb-6 flex items-center justify-between border-b border-[#30363d] pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#8b949e]">Feed</h2>
              <button className="flex items-center gap-1.5 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-medium hover:bg-[#30363d]">
                <Filter className="h-3 w-3" /> Filter
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                 <Star className="h-3 w-3" />
                 <span>Trending repositories</span>
                 <span className="mx-1">•</span>
                 <span className="text-[#58a6ff] cursor-pointer">See more</span>
              </div>

              {/* MOCK TRENDING REPO */}
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-6 w-6 rounded-full bg-blue-600"></div>
                       <h3 className="font-bold text-[#58a6ff]">ruvnet/ruflo</h3>
                    </div>
                    <div className="flex items-center rounded-md border border-[#30363d] bg-[#21262d]">
                       <button className="flex items-center gap-1 border-r border-[#30363d] px-3 py-1 text-xs font-semibold hover:bg-[#30363d]">
                         <Star className="h-3 w-3" /> Star
                       </button>
                       <button className="px-2 py-1 hover:bg-[#30363d]">
                         <ChevronDown className="h-3 w-3" />
                       </button>
                    </div>
                 </div>
                 <p className="mt-2 text-sm text-[#8b949e]">
                    The leading agent orchestration platform for Claude. Deploy intelligent multi-agent swarms, coordinate autonomous workflows, and build conversational AI systems.
                 </p>
                 <div className="mt-4 flex items-center gap-4 text-xs text-[#8b949e]">
                    <div className="flex items-center gap-1.5">
                       <div className="h-3 w-3 rounded-full bg-[#3178c6]"></div>
                       <span>TypeScript</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <Star className="h-3 w-3" />
                       <span>40.4k</span>
                    </div>
                 </div>
              </div>

              {/* REAL REPOS LIST */}
              <div className="space-y-4">
                {repos.map(repo => (
                  <RepoCard key={repo._id} repo={repo} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* RIGHT SIDEBAR - CHANGELOG */}
      <aside className="hidden w-80 flex-col border-l border-[#30363d] bg-[#0d1117] p-6 xl:flex">
         <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
            <div className="mb-4 flex items-center justify-between">
               <h3 className="text-xs font-bold text-white">Latest from our changelog</h3>
               <button className="text-[#8b949e] hover:text-white"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
            <ul className="space-y-6">
               <li className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-[#8b949e]">
                  <span className="text-[10px] text-[#8b949e]">3 days ago</span>
                  <p className="mt-1 text-sm font-medium text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer leading-tight">
                    Upcoming deprecation of GPT-3.5 and GPT-4.0-Codex
                  </p>
               </li>
               <li className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-[#8b949e]">
                  <span className="text-[10px] text-[#8b949e]">4 days ago</span>
                  <p className="mt-1 text-sm font-medium text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer leading-tight">
                    GitHub Copilot in Visual Studio — April update
                  </p>
               </li>
               <li className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-[#8b949e]">
                  <span className="text-[10px] text-[#8b949e]">Last week</span>
                  <p className="mt-1 text-sm font-medium text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer leading-tight">
                    Copilot Student GPT-3.5-Codex removal from model picker
                  </p>
               </li>
               <li className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-[#8b949e]">
                  <span className="text-[10px] text-[#8b949e]">Last week</span>
                  <p className="mt-1 text-sm font-medium text-[#e6edf3] hover:text-[#58a6ff] cursor-pointer leading-tight">
                    Copilot cloud agent starts 20% faster with Actions custom images
                  </p>
               </li>
            </ul>
            <button className="mt-6 text-[10px] font-bold text-[#8b949e] hover:text-[#58a6ff]">View changelog →</button>
         </div>
      </aside>
    </div>
  );
}