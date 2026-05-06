# GitClone - Modern Git Management Platform

![GitClone Preview](https://img.shields.io/badge/Status-Premium_UI-hotpink?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)

GitClone is a high-fidelity, full-stack replica of a modern version control platform. It features a premium "dark-mode" aesthetic with glassmorphic elements, a robust issue-tracking system, repository management, and cloud development environment simulations.

## ✨ Key Features

- **🚀 Premium Dashboard**: A sleek, high-density dashboard for managing repositories and activity.
- **📑 Modern Issue Tracking**: Complete workflow including issue creation with markdown-ready editors, detailed thread views, and label management.
- **📂 Repository Management**: 
  - Create new repositories with Gitignore and License templates.
  - **Import Repository**: Seamlessly import existing repositories from external URLs.
- **💼 GitHub Projects**: Kanban-style project boards for organizing work.
- **📝 Gists**: Instantly share code snippets and notes.
- **🖥️ Codespaces**: Cloud-based development environment simulations with machine type and region selection.
- **🎨 Premium UI/UX**: Built with custom Tailwind CSS, Lucide icons, and modern design principles (rose/violet accents, glassmorphism).

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Routing**: React Router 7
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens) & BcryptJS
- **File Handling**: Multer & Cloudinary

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd GITHUB
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   DB_URL=mongodb://localhost:27017/gitclone
   KEY=your_secret_jwt_key
   ```
   Start the server:
   ```bash
   node server.js
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```text
GITHUB/
├── backend/            # Express API & MongoDB Models
│   ├── APIs/           # Route Handlers
│   ├── models/         # Mongoose Schemas
│   ├── middleware/     # Auth & Error Handling
│   └── uploads/        # Temporary file storage
├── frontend/           # Vite + React Application
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── api.js      # Axios Configuration
│   │   └── App.jsx     # Routing Logic
└── .gitignore          # Global monorepo ignore rules
```

## 🔐 Security

- **JWT Authentication**: Secure login and session management.
- **Password Hashing**: Bcrypt encryption for user data.
- **Route Protection**: Middleware verification for all repository and issue actions.

## 📄 License

This project is licensed under the ISC License.

---
Built with ❤️ by [Pallavi-Chiluveru](https://github.com/Pallavi-Chiluveru)
