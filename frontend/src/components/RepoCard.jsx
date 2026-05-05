import { Link } from "react-router-dom";
import { Star, ChevronDown, GitBranch } from "lucide-react";

export default function RepoCard({ repo }) {
  // Map languages to colors (fallback to blue)
  const langColors = {
    "JavaScript": "#f1e05a",
    "Python": "#3572A5",
    "TypeScript": "#3178c6",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Java": "#b07219",
    "C++": "#f34b7d",
  };

  const langColor = langColors[repo.language] || "#8b949e";

  return (
    <div className="group rounded-xl border border-[#30363d] bg-[#0d1117] p-5 transition-all hover:bg-[#161b22]">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link 
              to={`/repo/${repo._id}`} 
              className="text-lg font-bold text-[#58a6ff] hover:underline"
            >
              {repo.name}
            </Link>
            <span className="rounded-full border border-[#30363d] px-2 py-0.5 text-[10px] font-medium text-[#8b949e]">
              {repo.isPublic ? "Public" : "Private"}
            </span>
          </div>
          <p className="text-sm text-[#8b949e] line-clamp-2 max-w-2xl">
            {repo.description || "No description provided for this repository."}
          </p>
        </div>

        <div className="flex items-center rounded-md border border-[#30363d] bg-[#21262d]">
          <button className="flex items-center gap-1.5 border-r border-[#30363d] px-3 py-1.5 text-xs font-semibold text-[#c9d1d9] hover:bg-[#30363d]">
            <Star className="h-3.5 w-3.5 text-[#8b949e]" /> Star
          </button>
          <button className="px-2 py-1.5 text-[#8b949e] hover:bg-[#30363d]">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 text-xs text-[#8b949e]">
        <div className="flex items-center gap-1.5">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: langColor }}
          ></div>
          <span className="text-[#c9d1d9]">{repo.language || "Unknown"}</span>
        </div>
        
        {repo.stars !== undefined && (
          <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
            <Star className="h-3.5 w-3.5" />
            <span>{repo.stars}</span>
          </div>
        )}

        <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
          <GitBranch className="h-3.5 w-3.5" />
          <span>main</span>
        </div>

        <span className="text-[10px]">Updated recently</span>
      </div>
    </div>
  );
}