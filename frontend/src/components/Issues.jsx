import { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";

export default function Issues() {
  const { id } = useParams();
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");

  const fetchIssues = async () => {
    const res = await API.get(`/issues/${id}`);
    setIssues(res.data);
  };

  const createIssue = async () => {
    await API.post("/issues", { repoId: id, title });
    setTitle("");
    fetchIssues();
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div>
      <h3>Issues</h3>

      <input
        placeholder="Issue title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createIssue}>Add Issue</button>

      {issues.map((issue) => (
        <div key={issue._id}>
          <p>{issue.title}</p>
        </div>
      ))}
    </div>
  );
}