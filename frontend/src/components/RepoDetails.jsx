import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
import { 
  Book, 
  Code, 
  MessageSquare, 
  GitPullRequest, 
  Play, 
  Shield, 
  BarChart2, 
  Settings,
  Star,
  GitBranch,
  Eye,
  File,
  Folder,
  History,
  ChevronDown,
  Globe,
  Lock,
  FileText,
  Activity,
  Terminal
} from "lucide-react";

export default function RepoDetails() {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await API.get(`/repo-api/${id}`);
        setRepo(res.data);
      } catch (err) {
        console.error("Failed to fetch repo details:", err);
      }
    };
    fetchRepo();
  }, [id]);

  if (!repo) return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#030712] text-slate-400">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mb-4"></div>
      <p className="text-lg font-bold animate-pulse">Initializing Project Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-indigo-500/30">
      {/* REPO HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md pt-8">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8">
            <div className="flex items-center gap-4 text-2xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                 <Book className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">{repo.owner?.username || "Unknown"}</Link>
                <span className="text-slate-700">/</span>
                <span className="text-white tracking-tight">{repo.name}</span>
              </div>
              <div className={`flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${repo.isPublic ? "text-emerald-400" : "text-purple-400"}`}>
                 {repo.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                 {repo.isPublic ? "Public" : "Private"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/50 shadow-sm overflow-hidden">
                <button className="flex items-center gap-1.5 border-r border-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all">
                   <Eye className="h-4 w-4" /> Watch
                </button>
                <button className="px-3 py-2 text-[11px] font-bold text-slate-500">0</button>
              </div>
              <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/50 shadow-sm overflow-hidden">
                <button className="flex items-center gap-1.5 border-r border-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all">
                   <Star className="h-4 w-4" /> Star
                </button>
                <button className="px-3 py-2 text-[11px] font-bold text-slate-500">0</button>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:scale-[1.02] transition-all">
                 <GitBranch className="h-4 w-4" /> Fork
              </button>
            </div>
          </div>

          {/* TABS */}
          <nav className="flex gap-2 overflow-x-auto text-sm font-bold">
             {[
               { id: 'code', icon: Code, label: 'Code', active: true },
               { id: 'issues', icon: MessageSquare, label: 'Issues', count: 0 },
               { id: 'pulls', icon: GitPullRequest, label: 'Pull requests', count: 0 },
               { id: 'actions', icon: Play, label: 'Actions' },
               { id: 'security', icon: Shield, label: 'Security' },
               { id: 'insights', icon: BarChart2, label: 'Insights' },
               { id: 'settings', icon: Settings, label: 'Settings' }
             ].map((tab) => (
               <button 
                 key={tab.id}
                 className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-4 transition-all ${tab.active ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
               >
                 <tab.icon className={`h-4 w-4 ${tab.active ? 'text-indigo-400' : 'text-slate-500'}`} />
                 {tab.label}
                 {tab.count !== undefined && <span className="ml-1 rounded-lg bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">{tab.count}</span>}
               </button>
             ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl p-6 md:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {/* FILE EXPLORER */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer transition-all">
                  <GitBranch className="h-4 w-4 text-indigo-400" /> main <ChevronDown className="h-3 w-3" />
               </div>
               <div className="flex gap-3">
                  <button className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all">Go to file</button>
                  <button className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all">Add file</button>
                  <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-xs font-bold text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                     <Terminal className="h-4 w-4" /> Code
                  </button>
               </div>
            </div>

            {/* REPO CONTENT LIST */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-2xl">
               {/* LATEST COMMIT BAR */}
               <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-xl bg-slate-800 overflow-hidden ring-2 ring-slate-800/50">
                        <img src={`https://ui-avatars.com/api/?name=${repo.owner?.username || "Guest"}&background=random`} alt="User" />
                     </div>
                     <div>
                        <span className="font-bold text-white hover:text-indigo-400 cursor-pointer">{repo.owner?.username || "Unknown"}</span>
                        <span className="text-slate-500 ml-2">Initial project commit</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500">
                     <span className="font-mono text-xs bg-slate-950 px-2 py-1 rounded-lg text-indigo-400">a1b2c3d</span>
                     <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest">
                        <History className="h-4 w-4" />
                        <span>1 Commit</span>
                     </div>
                  </div>
               </div>

               {/* FILE ROWS */}
               <div className="bg-transparent divide-y divide-slate-800/50">
                  <div className="flex items-center px-6 py-3.5 hover:bg-indigo-500/5 group cursor-pointer transition-all">
                     <div className="flex flex-1 items-center gap-4">
                        <Folder className="h-4 w-4 text-indigo-400 fill-indigo-400/10" />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-indigo-400">src</span>
                     </div>
                     <span className="flex-1 text-xs text-slate-500">Update project logic</span>
                     <span className="text-[11px] text-slate-600 font-medium">2 hours ago</span>
                  </div>
                  <div className="flex items-center px-6 py-3.5 hover:bg-indigo-500/5 group cursor-pointer transition-all">
                     <div className="flex flex-1 items-center gap-4">
                        <File className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-indigo-400">README.md</span>
                     </div>
                     <span className="flex-1 text-xs text-slate-500">Add detailed documentation</span>
                     <span className="text-[11px] text-slate-600 font-medium">2 hours ago</span>
                  </div>
                  <div className="flex items-center px-6 py-3.5 hover:bg-indigo-500/5 group cursor-pointer transition-all">
                     <div className="flex flex-1 items-center gap-4">
                        <File className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-indigo-400">package.json</span>
                     </div>
                     <span className="flex-1 text-xs text-slate-500">Initialize project deps</span>
                     <span className="text-[11px] text-slate-600 font-medium">2 hours ago</span>
                  </div>
               </div>
            </div>

            {/* README PREVIEW */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm mt-8 shadow-2xl overflow-hidden">
               <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/60 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  README.md
               </div>
               <div className="p-10">
                  <h1 className="text-4xl font-extrabold text-white border-b border-slate-800 pb-4 mb-6 tracking-tight">{repo.name}</h1>
                  <p className="text-lg text-slate-400 leading-relaxed font-medium">
                    {repo.description || "Welcome to your new project! No description provided yet."}
                  </p>
                  
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">License</h4>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                           <Shield className="h-4 w-4 text-emerald-400" />
                           {repo.license || "None"}
                        </p>
                     </div>
                     <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">GitIgnore</h4>
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                           <Code className="h-4 w-4 text-indigo-400" />
                           {repo.gitignore || "None"}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl">
              <h3 className="mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">About</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{repo.description || "No description provided."}</p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                 <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">mern</span>
                 <span className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold text-purple-400 border border-purple-500/20 uppercase tracking-wider">premium-ui</span>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                 <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-500">
                       <Activity className="h-4 w-4" /> Stars
                    </div>
                    <span className="text-white">0</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-500">
                       <Eye className="h-4 w-4" /> Watchers
                    </div>
                    <span className="text-white">0</span>
                 </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl">
              <h3 className="mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Languages</h3>
              <div className="h-2.5 w-full flex overflow-hidden rounded-full bg-slate-800 shadow-inner">
                 <div className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]" style={{ width: '65%' }}></div>
                 <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" style={{ width: '25%' }}></div>
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ width: '10%' }}></div>
              </div>
              <div className="mt-6 space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                       <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                       <span className="text-xs font-bold text-slate-300">JavaScript</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">65%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                       <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                       <span className="text-xs font-bold text-slate-300">TypeScript</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">25%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                       <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                       <span className="text-xs font-bold text-slate-300">HTML</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">10%</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}