import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import RepoDetails from "./components/RepoDetails";
import Navbar from "./components/Navbar";
import CreateRepo from "./components/CreateRepo";
import Issues from "./components/Issues";
import Collaborators from "./components/Collaborators";
import CreateOrg from "./components/CreateOrg";
import CreateIssue from "./components/CreateIssue";
import NewIssueForm from "./components/NewIssueForm";
import IssueDetails from "./components/IssueDetails";
import ImportRepo from "./components/ImportRepo";
import CreateProject from "./components/CreateProject";
import CreateGist from "./components/CreateGist";
import Codespaces from "./components/Codespaces";
import CreateCodespace from "./components/CreateCodespace";









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
        <Route path="/org" element={<CreateOrg />} />
        <Route path="/repo/:id/issues" element={<Issues />} />
        <Route path="/repo/:id/collaborators" element={<Collaborators />} />
        <Route path="/new-issue" element={<CreateIssue />} />
        <Route path="/repo/:id/new-issue" element={<NewIssueForm />} />
        <Route path="/repo/:repoId/issues/:issueId" element={<IssueDetails />} />
        <Route path="/import" element={<ImportRepo />} />
        <Route path="/new-project" element={<CreateProject />} />
        <Route path="/gist" element={<CreateGist />} />
        <Route path="/codespaces" element={<Codespaces />} />
        <Route path="/codespaces/new" element={<CreateCodespace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;