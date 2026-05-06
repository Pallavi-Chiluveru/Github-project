import { useState } from "react";
import { 
  Plus, 
  ChevronDown, 
  Globe, 
  Lock, 
  Code2, 
  Info,
  CheckCircle2
} from "lucide-react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateRepo() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [addReadme, setAddReadme] = useState(false);
  const [gitignore, setGitignore] = useState("None");
  const [license, setLicense] = useState("None");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return alert("Repository name is required");
    
    setLoading(true);
    try {
      await API.post("/repo-api/createRepo", { 
        name, 
        description, 
        isPublic, 
        addReadme,
        gitignore,
        license
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Creation failed:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Connection error - please check if server is running";
      alert(msg);
    } finally {     
      setLoading(false);
    }
  };

  const gitignoreOptions = ["None", "Node", "Python", "Java", "C++", "Go", "Rust", "Unity"];
  const licenseOptions = ["None", "MIT", "Apache 2.0", "GPLv3", "BSD 3-Clause", "Unlicense"];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 pb-20 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-4xl px-6 pt-12">
        <header className="mb-10 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 mb-4">
            <Code2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Create New Project</h1>
          <p className="mt-3 text-lg text-slate-400">
            A repository contains all your project files, including the revision history.
          </p>
        </header>

        <form onSubmit={handleCreate} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: PRIMARY INFO */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-indigo-400">01</span>
                   </div>
                   <h2 className="text-xl font-bold text-white">General Information</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-300">Owner</label>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5">
                        <div className="h-6 w-6 rounded-full overflow-hidden ring-2 ring-slate-800">
                           <img src={`https://ui-avatars.com/api/?name=${user?.username || "Guest"}&background=random`} alt="User" />
                        </div>
                        <span className="text-sm font-medium text-slate-200">{user?.username || "Loading..."}</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-slate-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-300">Repository Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. my-awesome-app"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex justify-between">
                      Description <span className="text-xs font-normal text-slate-500">{description.length}/350</span>
                    </label>
                    <textarea
                      rows="3"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                      placeholder="Briefly describe your project..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-400">02</span>
                   </div>
                   <h2 className="text-xl font-bold text-white">Visibility & Access</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button 
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`flex flex-col items-start gap-3 rounded-2xl border p-5 transition-all text-left group ${isPublic ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500" : "border-slate-800 bg-slate-950/50 hover:border-slate-700"}`}
                   >
                      <div className={`p-2 rounded-lg ${isPublic ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isPublic ? "text-white" : "text-slate-300"}`}>Public</span>
                          {isPublic && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Anyone on the internet can see this project. You choose who can commit.</p>
                      </div>
                   </button>

                   <button 
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`flex flex-col items-start gap-3 rounded-2xl border p-5 transition-all text-left group ${!isPublic ? "border-purple-500 bg-purple-500/5 ring-1 ring-purple-500" : "border-slate-800 bg-slate-950/50 hover:border-slate-700"}`}
                   >
                      <div className={`p-2 rounded-lg ${!isPublic ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${!isPublic ? "text-white" : "text-slate-300"}`}>Private</span>
                          {!isPublic && <CheckCircle2 className="h-4 w-4 text-purple-400" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">You choose who can see and commit to this project.</p>
                      </div>
                   </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ADDITIONAL OPTIONS */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm shadow-xl h-full">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-400">03</span>
                   </div>
                   <h2 className="text-xl font-bold text-white">Initialize Project</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                    <div className="flex gap-3 items-center">
                      <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        <Plus className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Add README</p>
                        <p className="text-[10px] text-slate-500">Longer description</p>
                      </div>
                    </div>
                    <div 
                        onClick={() => setAddReadme(!addReadme)}
                        className={`h-6 w-11 rounded-full relative cursor-pointer transition-all ${addReadme ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-slate-800"}`}
                      >
                        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${addReadme ? "left-6" : "left-1"}`}></div>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <span>.gitignore Template</span>
                      <Info className="h-3 w-3 text-slate-500" />
                    </div>
                    <select 
                      value={gitignore}
                      onChange={(e) => setGitignore(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer hover:bg-slate-950 transition-colors"
                    >
                      {gitignoreOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt === "None" ? "No .gitignore" : opt}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <span>Choose License</span>
                      <Info className="h-3 w-3 text-slate-500" />
                    </div>
                    <select 
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer hover:bg-slate-950 transition-colors"
                    >
                      {licenseOptions.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt === "None" ? "No license" : opt}</option>)}
                    </select>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-bold text-white shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Creating...
                        </div>
                      ) : "Create Repository"}
                    </button>
                    <p className="mt-4 text-center text-[11px] text-slate-500 leading-relaxed px-4">
                      By clicking "Create Repository", you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}