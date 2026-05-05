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
  ChevronDown
} from "lucide-react";

export default function RepoDetails() {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await API.get(`/repo/${id}`);
        setRepo(res.data);
      } catch (err) {
        console.error("Failed to fetch repo details:", err);
      }
    };
    fetchRepo();
  }, [id]);

  if (!repo) return (
    <div className="flex h-screen items-center justify-center bg-[#0d1117] text-[#8b949e]">
      <div className="animate-pulse">Loading repository...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* REPO HEADER */}
      <header className="border-b border-[#30363d] bg-[#010409] pt-4">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Book className="h-5 w-5 text-[#8b949e]" />
              <Link to="/dashboard" className="text-[#58a6ff] hover:underline">{repo.owner?.username || "Unknown"}</Link>
              <span className="text-[#8b949e]">/</span>
              <span className="text-white">{repo.name}</span>
              <span className="ml-2 rounded-full border border-[#30363d] px-2 py-0.5 text-[11px] font-medium text-[#8b949e]">
                {repo.isPublic ? "Public" : "Private"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border border-[#30363d] bg-[#21262d]">
                <button className="flex items-center gap-1.5 border-r border-[#30363d] px-3 py-1 text-xs font-semibold hover:bg-[#30363d]">
                   <Eye className="h-4 w-4" /> Watch <ChevronDown className="h-3 w-3" />
                </button>
                <button className="px-2 py-1 text-[11px] font-bold">0</button>
              </div>
              <div className="flex items-center rounded-md border border-[#30363d] bg-[#21262d]">
                <button className="flex items-center gap-1.5 border-r border-[#30363d] px-3 py-1 text-xs font-semibold hover:bg-[#30363d]">
                   <Star className="h-4 w-4" /> Star <ChevronDown className="h-3 w-3" />
                </button>
                <button className="px-2 py-1 text-[11px] font-bold">0</button>
              </div>
              <div className="flex items-center rounded-md border border-[#30363d] bg-[#21262d]">
                <button className="flex items-center gap-1.5 border-r border-[#30363d] px-3 py-1 text-xs font-semibold hover:bg-[#30363d]">
                   <GitBranch className="h-4 w-4" /> Fork
                </button>
                <button className="px-2 py-1 text-[11px] font-bold">0</button>
              </div>
            </div>
          </div>

          {/* TABS */}
          <nav className="flex gap-1 overflow-x-auto text-sm font-medium">
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
                 className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 transition-colors ${tab.active ? 'border-[#f78166] text-white' : 'border-transparent text-[#c9d1d9] hover:border-[#8b949e] hover:text-white'}`}
               >
                 <tab.icon className={`h-4 w-4 ${tab.active ? 'text-[#f78166]' : 'text-[#8b949e]'}`} />
                 {tab.label}
                 {tab.count !== undefined && <span className="rounded-full bg-[#30363d] px-1.5 py-0.5 text-[10px]">{tab.count}</span>}
               </button>
             ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* FILE EXPLORER */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1 text-sm font-semibold">
                  <GitBranch className="h-4 w-4 text-[#8b949e]" /> main <ChevronDown className="h-3 w-3" />
               </div>
               <div className="flex gap-2">
                  <button className="rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1 text-sm font-semibold hover:bg-[#30363d]">Go to file</button>
                  <button className="rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1 text-sm font-semibold hover:bg-[#30363d]">Add file <ChevronDown className="inline h-3 w-3" /></button>
                  <button className="rounded-md bg-[#238636] px-3 py-1 text-sm font-bold text-white hover:bg-[#2ea043]">Code <ChevronDown className="inline h-3 w-3" /></button>
               </div>
            </div>

            {/* REPO CONTENT LIST */}
            <div className="rounded-lg border border-[#30363d] overflow-hidden">
               {/* LATEST COMMIT BAR */}
               <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                     <div className="h-6 w-6 rounded-full bg-slate-700 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${repo.owner?.username || "Guest"}&background=random`} alt="User" />
                     </div>
                     <span className="font-bold">{repo.owner?.username || "Unknown"}</span>
                     <span className="text-[#8b949e]">Initial commit</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#8b949e]">
                     <span className="font-mono text-xs hover:text-[#58a6ff] cursor-pointer">a1b2c3d</span>
                     <span>today</span>
                     <History className="h-4 w-4" />
                     <span className="font-bold text-white">1</span>
                     <span>commit</span>
                  </div>
               </div>

               {/* FILE ROWS */}
               <div className="bg-[#0d1117]">
                  <div className="flex items-center px-4 py-2 border-b border-[#30363d] hover:bg-[#161b22] group cursor-pointer">
                     <div className="flex flex-1 items-center gap-3">
                        <Folder className="h-4 w-4 text-[#58a6ff]" />
                        <span className="text-sm group-hover:text-[#58a6ff] group-hover:underline">src</span>
                     </div>
                     <span className="flex-1 text-sm text-[#8b949e]">Update logic</span>
                     <span className="text-sm text-[#8b949e]">today</span>
                  </div>
                  <div className="flex items-center px-4 py-2 border-b border-[#30363d] hover:bg-[#161b22] group cursor-pointer">
                     <div className="flex flex-1 items-center gap-3">
                        <File className="h-4 w-4 text-[#8b949e]" />
                        <span className="text-sm group-hover:text-[#58a6ff] group-hover:underline">README.md</span>
                     </div>
                     <span className="flex-1 text-sm text-[#8b949e]">Add documentation</span>
                     <span className="text-sm text-[#8b949e]">today</span>
                  </div>
                  <div className="flex items-center px-4 py-2 hover:bg-[#161b22] group cursor-pointer">
                     <div className="flex flex-1 items-center gap-3">
                        <File className="h-4 w-4 text-[#8b949e]" />
                        <span className="text-sm group-hover:text-[#58a6ff] group-hover:underline">package.json</span>
                     </div>
                     <span className="flex-1 text-sm text-[#8b949e]">Initial commit</span>
                     <span className="text-sm text-[#8b949e]">today</span>
                  </div>
               </div>
            </div>

            {/* README PREVIEW */}
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] mt-6">
               <div className="flex items-center gap-2 border-b border-[#30363d] px-4 py-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-[#8b949e]" />
                  README.md
               </div>
               <div className="p-8">
                  <h1 className="text-3xl font-bold border-b border-[#30363d] pb-2 mb-4">{repo.name}</h1>
                  <p className="text-lg text-[#8b949e]">
                    {repo.description || "No description provided for this repository."}
                  </p>
               </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-bold text-white">About</h3>
              <p className="text-sm text-[#8b949e]">{repo.description || "No description provided."}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                 <span className="rounded-full bg-[#388bfd1a] px-2 py-0.5 text-xs text-[#58a6ff]">mern</span>
                 <span className="rounded-full bg-[#388bfd1a] px-2 py-0.5 text-xs text-[#58a6ff]">git-clone</span>
              </div>
            </div>

            <div className="border-t border-[#30363d] pt-4">
              <h3 className="mb-2 text-sm font-bold text-white">Languages</h3>
              <div className="h-2 w-full flex overflow-hidden rounded-full bg-[#30363d]">
                 <div className="h-full bg-[#f1e05a]" style={{ width: '60%' }}></div>
                 <div className="h-full bg-[#3178c6]" style={{ width: '30%' }}></div>
                 <div className="h-full bg-[#e34c26]" style={{ width: '10%' }}></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#f1e05a]"></div><span className="font-bold text-[#c9d1d9]">JavaScript</span> <span className="text-[#8b949e]">60%</span></div>
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#3178c6]"></div><span className="font-bold text-[#c9d1d9]">TypeScript</span> <span className="text-[#8b949e]">30%</span></div>
                 <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#e34c26]"></div><span className="font-bold text-[#c9d1d9]">HTML</span> <span className="text-[#8b949e]">10%</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}