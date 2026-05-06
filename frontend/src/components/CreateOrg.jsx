import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check, Info, Headphones } from "lucide-react";

export default function CreateOrg() {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [belongsTo, setBelongsTo] = useState("personal");
  const [acceptedToS, setAcceptedToS] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!orgName || !email) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!acceptedToS) {
      alert("You must accept the Terms of Service.");
      return;
    }
    alert("Organization creation is a mock for now. Redirecting to dashboard.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] pb-20 pt-16 font-sans">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center mb-10">
          <p className="text-sm text-[#8b949e]">Tell us about your organization</p>
          <h1 className="text-4xl font-bold text-white mt-2">Set up your organization</h1>
        </div>

        <div className="space-y-8 animate-in fade-in duration-500">
          {/* SECTION 1: DETAILS */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-white">
              Organization name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. My Organization"
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#e6edf3] focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
            />
            <div className="text-xs text-[#8b949e] space-y-1">
              <p>This will be the name of your account on GitClone.</p>
              <p>Your URL will be: <span className="text-[#58a6ff]">https://gitclone.com/{orgName || "[name]"}</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-white">
              Contact email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#e6edf3] focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-white">This organization belongs to:</p>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-1">
                  <input 
                    type="radio" 
                    name="belongsTo" 
                    checked={belongsTo === "personal"}
                    onChange={() => setBelongsTo("personal")}
                    className="hidden" 
                  />
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${belongsTo === "personal" ? "border-[#1f6feb] bg-[#1f6feb]" : "border-[#30363d] bg-transparent"}`}>
                    {belongsTo === "personal" && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-[#58a6ff]">My personal account</p>
                  <p className="text-xs text-[#8b949e]">i.e., {user?.name || "User"} ({user?.email || "user@example.com"})</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-1">
                  <input 
                    type="radio" 
                    name="belongsTo" 
                    checked={belongsTo === "business"}
                    onChange={() => setBelongsTo("business")}
                    className="hidden" 
                  />
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${belongsTo === "business" ? "border-[#1f6feb] bg-[#1f6feb]" : "border-[#30363d] bg-transparent"}`}>
                    {belongsTo === "business" && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-[#58a6ff]">A business or institution</p>
                  <p className="text-xs text-[#8b949e]">For example: GitClone, Inc., Example Institute, American Red Cross</p>
                </div>
              </label>
            </div>
          </div>

          {/* SECTION 2: TERMS AND ACTION (Visible below) */}
          <div className="pt-6 border-t border-[#30363d] space-y-6">
            <div className="flex items-start gap-3">
              <input 
                id="tos"
                type="checkbox" 
                checked={acceptedToS}
                onChange={() => setAcceptedToS(!acceptedToS)}
                className="mt-1 h-4 w-4 rounded border-[#30363d] bg-[#0d1117] text-[#1f6feb] focus:ring-[#1f6feb] cursor-pointer"
              />
              <label htmlFor="tos" className="text-xs text-[#8b949e] leading-relaxed cursor-pointer select-none">
                I hereby accept the <span className="text-[#58a6ff] hover:underline">Terms of Service</span>. For more information about GitClone's privacy practices, see the <span className="text-[#58a6ff] hover:underline">GitClone Privacy Statement</span>.
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 rounded-md border border-[#30363d] bg-[#21262d] py-2.5 text-sm font-bold text-white hover:bg-[#30363d] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={!acceptedToS}
                className={`flex-[2] rounded-md py-2.5 text-sm font-bold text-white transition-all shadow-md ${acceptedToS ? "bg-[#238636] hover:bg-[#2ea043] scale-[1.02] active:scale-[0.98]" : "bg-[#238636]/40 cursor-not-allowed"}`}
              >
                Create organization
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer mimic */}
      <footer className="fixed bottom-0 w-full border-t border-[#30363d] bg-[#0d1117] py-4">
         <div className="mx-auto max-w-5xl px-6 flex flex-wrap justify-center gap-4 text-[10px] text-[#8b949e]">
            <span>© 2026 GitClone, Inc.</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Terms</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Privacy</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Security</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Status</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Docs</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Contact</span>
         </div>
      </footer>
    </div>
  );
}
