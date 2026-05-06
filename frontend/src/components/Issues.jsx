import { useEffect, useState } from "react";
import API from "../api";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  CircleDot, 
  MessageSquare, 
  Search, 
  ChevronDown, 
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  User,
  X,
  Tag
} from "lucide-react";


export default function Issues() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLabelOpen, setIsLabelOpen] = useState(false);

  const labels = [
    { name: 'bug', color: '#d73a4a', desc: "Something isn't working" },
    { name: 'documentation', color: '#0075ca', desc: 'Improvements or additions to documentation' },
    { name: 'duplicate', color: '#cfd3d7', desc: 'This issue or pull request already exists' },
    { name: 'enhancement', color: '#a2eeef', desc: 'New feature or request' },
    { name: 'good first issue', color: '#7057ff', desc: 'Good for newcomers' },
    { name: 'help wanted', color: '#008672', desc: 'Extra attention is needed' },
    { name: 'invalid', color: '#e4e669', desc: "This doesn't seem right" },
    { name: 'question', color: '#d876e3', desc: 'Further information is requested' },
    { name: 'wontfix', color: '#ffffff', desc: 'This will not be worked on' },
  ];


  const fetchIssues = async () => {
    try {
      const res = await API.get(`/issue-api/${id}`);
      setIssues(res.data);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
    }
  };

  const fetchRepo = async () => {
    try {
      const res = await API.get(`/repo-api/${id}`);
      setRepo(res.data);
    } catch (err) {
      console.error("Failed to fetch repo:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchIssues(), fetchRepo()]);
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d1117]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ec4899] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] text-[#c9d1d9] pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-6">
           <Link to="/dashboard" className="text-[#8b949e] hover:text-[#ec4899] transition-colors">Dashboard</Link>
           <span className="text-[#30363d]">/</span>
           <Link to={`/repo/${id}`} className="text-[#8b949e] hover:text-[#ec4899] transition-colors">{repo?.name}</Link>
           <span className="text-[#30363d]">/</span>
           <span className="font-bold text-[#f0f6fc]">Issues</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#ec4899]/10 flex items-center justify-center">
                 <CircleDot className="h-6 w-6 text-[#ec4899]" />
              </div>
              <div>
                 <h1 className="text-2xl font-bold text-[#f0f6fc]">Issues</h1>
                 <p className="text-sm text-[#8b949e]">Track bugs and feature requests</p>
              </div>
           </div>

           <Link 
            to={`/repo/${id}/new-issue`}
            className="flex items-center gap-2 rounded-lg bg-[#238636] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2ea043] shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
           >
             <Plus className="h-4 w-4" /> New issue
           </Link>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8b949e]" />
              <input 
                type="text" 
                placeholder="is:open is:issue "
                className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] py-2 pl-10 pr-4 text-sm text-[#f0f6fc] focus:border-[#ec4899] focus:outline-none transition-all"
              />
           </div>
            <div className="relative">
              <button 
                onClick={() => setIsLabelOpen(!isLabelOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-sm font-medium hover:bg-[#30363d] transition-all"
              >
                Labels <ChevronDown className="h-3 w-3" />
              </button>

              {isLabelOpen && (
                <div className="absolute left-0 mt-2 z-50 w-[300px] rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#30363d] px-4 py-2 bg-[#0d1117]">
                    <span className="text-xs font-bold text-[#f0f6fc]">Filter by label</span>
                    <button onClick={() => setIsLabelOpen(false)}><X className="h-3.5 w-3.5 text-[#8b949e] hover:text-[#f0f6fc]" /></button>
                  </div>
                  <div className="p-2 border-b border-[#30363d]">
                    <div className="relative">
                       <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-[#8b949e]" />
                       <input 
                         type="text" 
                         placeholder="Filter labels" 
                         className="w-full rounded-md border border-[#30363d] bg-[#0d1117] py-1.5 pl-8 pr-4 text-xs text-[#f0f6fc] focus:border-[#ec4899] focus:outline-none"
                       />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {labels.map((label) => (
                      <button 
                        key={label.name}
                        className="flex w-full items-start gap-3 px-4 py-2 text-left hover:bg-indigo-600 transition-colors group"
                      >
                         <div className="mt-1 h-3.5 w-3.5 rounded-full border border-white/20" style={{ backgroundColor: label.color }}></div>
                         <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-[#f0f6fc]">{label.name}</p>
                            <p className="text-[10px] text-[#8b949e] group-hover:text-white/70">{label.desc}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#30363d] p-2">
                     <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#21262d] py-1.5 text-xs font-bold text-[#f0f6fc] hover:bg-[#30363d] transition-all">
                        <Tag className="h-3 w-3" /> Edit labels
                     </button>
                  </div>
                </div>
              )}
            </div>
           <button className="flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-2 text-sm font-medium hover:bg-[#30363d] transition-all">
              Milestones <ChevronDown className="h-3 w-3" />
           </button>
        </div>

        {/* Issues List Container */}
        <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-xl">
           {/* List Header */}
           <div className="flex items-center justify-between bg-[#161b22] border-b border-[#30363d] px-6 py-4">
              <div className="flex items-center gap-4">
                 <button className="flex items-center gap-1.5 text-sm font-bold text-[#f0f6fc]">
                    <CircleDot className="h-4 w-4" /> {issues.length} Open
                 </button>
                 <button className="flex items-center gap-1.5 text-sm font-medium text-[#8b949e] hover:text-[#f0f6fc]">
                    <CheckCircle2 className="h-4 w-4" /> 0 Closed
                 </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                 <button className="hover:text-[#f0f6fc] flex items-center gap-1">Author <ChevronDown className="h-3 w-3" /></button>
                 <button className="hover:text-[#f0f6fc] flex items-center gap-1">Label <ChevronDown className="h-3 w-3" /></button>
                 <button className="hover:text-[#f0f6fc] flex items-center gap-1">Projects <ChevronDown className="h-3 w-3" /></button>
                 <button className="hover:text-[#f0f6fc] flex items-center gap-1">Sort <ChevronDown className="h-3 w-3" /></button>
              </div>
           </div>

           {/* List Items */}
           <div className="divide-y divide-[#30363d]">
              {issues.length > 0 ? (
                issues.map((issue) => (
                  <div key={issue._id} className="flex items-start gap-3 px-6 py-4 hover:bg-[#161b22] transition-colors group">
                     <CircleDot className="h-4 w-4 mt-1 text-[#3fb950]" />
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <Link 
                            to={`/repo/${id}/issues/${issue._id}`}
                            className="text-base font-bold text-[#f0f6fc] hover:text-[#ec4899] transition-colors"
                           >
                              {issue.title}
                           </Link>
                           {/* Fake labels */}
                           <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400">bug</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#8b949e]">
                           <span>#{issue._id.slice(-4)}</span>
                           <span>opened 2 hours ago by <span className="hover:text-[#ec4899] cursor-pointer">Pallavi-Chiluveru</span></span>
                           <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> 0</span>
                        </div>
                     </div>
                     <div className="hidden sm:flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#30363d] overflow-hidden">
                           <img src="https://ui-avatars.com/api/?name=User&background=random" alt="" />
                        </div>
                     </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                   <div className="h-16 w-16 rounded-full bg-[#30363d]/30 flex items-center justify-center mb-4">
                      <CircleDot className="h-8 w-8 text-[#8b949e]" />
                   </div>
                   <h3 className="text-xl font-bold text-[#f0f6fc]">Welcome to issues!</h3>
                   <p className="mt-2 text-[#8b949e] max-w-md">Issues are used to track todos, bugs, feature requests, and more. As issues are created, they’ll appear here in a list.</p>
                   <Link 
                    to={`/repo/${id}/new-issue`}
                    className="mt-6 rounded-lg bg-[#238636] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2ea043] transition-all shadow-lg shadow-emerald-900/20"
                   >
                     New issue
                   </Link>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}