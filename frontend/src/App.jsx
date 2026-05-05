import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import RepoDetails from "./components/RepoDetails";
import Navbar from "./components/Navbar";
import CreateRepo from "./components/CreateRepo";
import Issues from "./components/Issues";
import Collaborators from "./components/Collaborators";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repo/:id" element={<RepoDetails />} />
        <Route path="/create-repo" element={<CreateRepo />} />
<Route path="/repo/:id/issues" element={<Issues />} />
<Route path="/repo/:id/collaborators" element={<Collaborators />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;