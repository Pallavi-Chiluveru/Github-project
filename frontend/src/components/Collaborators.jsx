import { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";

export default function Collaborators() {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");

  const fetchCollaborators = async () => {
    const res = await API.get(`/collaboration/${id}`);
    setUsers(res.data);
  };

  const addCollaborator = async () => {
    await API.post("/collaboration", {
      repoId: id,
      email,
    });
    setEmail("");
    fetchCollaborators();
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  return (
    <div>
      <h3>Collaborators</h3>

      <input
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={addCollaborator}>Add</button>

      {users.map((user) => (
        <div key={user._id}>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}