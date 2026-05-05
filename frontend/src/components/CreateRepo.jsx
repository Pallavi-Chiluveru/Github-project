import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { 
  Book, 
  ChevronDown, 
  Lock, 
  Globe, 
  Info, 
  FileText, 
  Shield, 
  Eye
} from "lucide-react";

export default function CreateRepo() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return alert("Repository name is required");
    
    setLoading(true);
    try {
      await API.post("/repo", { name, description, isPublic });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Error creating repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] pb-20">
      <div className="mx-auto max-w-3xl px-6 pt-10">
        <header className="mb-8 border-b border-[#30363d] pb-6">
          <h1 className="text-2xl font-semibold text-white">Create a new repository</h1>
          <p className="mt-1 text-sm text-[#8b949e]">
            Repositories contain a project's files and version history. Have a project elsewhere? 
            <span className="ml-1 text-[#58a6ff] hover:underline cursor-pointer">Import a repository.</span>
          </p>
          <p className="mt-4 text-xs text-[#8b949e]">Required fields are marked with an asterisk (*).</p>
        </header>

        <form onSubmit={handleCreate} className="space-y-8">
          {/* SECTION 1: GENERAL */}
          <section className="relative pl-8 before:absolute before:left-0 before:top-0 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:bg-[#161b22] before:text-xs before:font-bold before:text-[#8b949e] before:content-['1']">
            <h2 className="mb-4 text-base font-semibold text-white">General</h2>
            
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-semibold text-white">Owner *</label>
                <div className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm">
                   <div className="h-5 w-5 rounded-full bg-slate-700 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${user?.username || "Guest"}&background=random`} alt="User" />
                   </div>
                   <span className="font-medium text-[#e6edf3]">{user?.username || "Loading..."}</span>
                   <ChevronDown className="ml-auto h-4 w-4 text-[#8b949e]" />
                </div>
              </div>

              <div className="hidden pb-2 text-2xl text-[#30363d] md:block">/</div>

              <div className="flex-[2]">
                <label className="mb-2 block text-sm font-semibold text-white">Repository name *</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-sm text-[#e6edf3] focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
                  placeholder="name-your-repo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-[#8b949e]">
              Great repository names are short and memorable. How about <span className="font-bold text-[#3fb950] italic">shiny-octo-couscous</span>?
            </p>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-white">
                Description <span className="font-normal text-[#8b949e]">(optional)</span>
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-sm text-[#e6edf3] focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="mt-1 text-[10px] text-[#8b949e]">{description.length} / 350 characters</p>
            </div>
          </section>

          {/* SECTION 2: CONFIGURATION */}
          <section className="relative pl-8 before:absolute before:left-0 before:top-0 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:bg-[#161b22] before:text-xs before:font-bold before:text-[#8b949e] before:content-['2']">
            <h2 className="mb-4 text-base font-semibold text-white">Configuration</h2>

            {/* VISIBILITY */}
            <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden">
               <div className="p-4">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-sm font-semibold text-white">Choose visibility *</h3>
                        <p className="text-xs text-[#8b949e]">Choose who can see and commit to this repository</p>
                     </div>
                     <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setIsPublic(true)}
                          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-all ${isPublic ? "border-[#1f6feb] bg-[#1f6feb]/10 text-[#58a6ff]" : "border-[#30363d] bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]"}`}
                        >
                           <Globe className="h-4 w-4" /> Public
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsPublic(false)}
                          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-all ${!isPublic ? "border-[#1f6feb] bg-[#1f6feb]/10 text-[#58a6ff]" : "border-[#30363d] bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]"}`}
                        >
                           <Lock className="h-4 w-4" /> Private
                        </button>
                     </div>
                  </div>
               </div>

               {/* HELP TEXT */}
               <div className="bg-[#0d1117] p-3 text-[11px] text-[#8b949e] border-t border-[#30363d]">
                  {isPublic ? (
                    <p>Anyone on the internet can see this repository. You choose who can commit.</p>
                  ) : (
                    <p>You choose who can see and commit to this repository.</p>
                  )}
               </div>
            </div>

            {/* OPTIONS */}
            <div className="mt-6 space-y-4">
               <div className="flex items-center justify-between rounded-lg border border-[#30363d] bg-[#161b22] p-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Add README</h3>
                    <p className="text-xs text-[#8b949e]">READMEs can be used as longer descriptions. <span className="text-[#58a6ff] hover:underline cursor-pointer">About READMEs</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs text-[#8b949e]">Off</span>
                     <div className="h-5 w-10 rounded-full bg-[#30363d] relative cursor-not-allowed">
                        <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-[#8b949e]"></div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between rounded-lg border border-[#30363d] bg-[#161b22] p-4 opacity-70">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Add .gitignore</h3>
                    <p className="text-xs text-[#8b949e]">.gitignore tells git which files not to track. <span className="text-[#58a6ff] hover:underline cursor-pointer">About .gitignore files</span></p>
                  </div>
                  <button type="button" className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-semibold text-[#8b949e]">
                     No .gitignore <ChevronDown className="h-4 w-4" />
                  </button>
               </div>

               <div className="flex items-center justify-between rounded-lg border border-[#30363d] bg-[#161b22] p-4 opacity-70">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Add license</h3>
                    <p className="text-xs text-[#8b949e]">Licenses explain how others can use your code. <span className="text-[#58a6ff] hover:underline cursor-pointer">About licenses</span></p>
                  </div>
                  <button type="button" className="flex items-center gap-2 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs font-semibold text-[#8b949e]">
                     No license <ChevronDown className="h-4 w-4" />
                  </button>
               </div>
            </div>
          </section>

          <div className="mt-10 flex justify-end border-t border-[#30363d] pt-8">
            <button
              type="submit"
              disabled={loading || !name}
              className={`rounded-md bg-[#238636] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#2ea043] focus:ring-2 focus:ring-[#238636] focus:ring-offset-2 focus:ring-offset-[#0d1117] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? "Creating..." : "Create repository"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}