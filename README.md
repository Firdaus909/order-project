# 🧑‍💻 React Authentication & CRUD Web App

A full-stack React.js web application that includes:
- 🔐 Authentication with login attempt limitation
- 📋 CRUD-enabled data table with filters
- 🌐 Hosted for free on Vercel
- 🛢️ Integrated with Supabase (Free PostgreSQL DB)

## 🔗 Live Demo & Source Code

- 🌍 Live Site: [https://your-app.vercel.app](https://your-app.vercel.app)
- 💾 Source Code: [https://github.com/Firdaus909/order-project](https://github.com/Firdaus909/order-project)

---

## 🚀 Features

### 📝 Page 1 - Authentication Form
- Username and Password fields
- Submit button connected to Supabase for credential verification
- Login attempt limit (Max 3 times)
- "Forgot Password?" link with working logic
- "Don’t Have an Account?" link with registration form

### 📄 Page 2 - Functional CRUD Table
- Full Create, Read, Update, Delete operations
- Data stored and synced with Supabase
- "Add" button opens modal form to insert data
- Each row includes Edit and Delete buttons
- Filtering support for:
  - Region
  - Branch
  - Status

---

## 🛠️ Tech Stack

- **Frontend**: React.js & TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**:
  - **Frontend**: Vercel
  - **Database**: Supabase

---

## 🧪 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Firdaus909/order-project
cd order-project

# Install dependencies
npm install

# Create .env file for Supabase config
cp .env.example .env
# Fill in your Supabase URL and anon/public key

# Start the development server
npm run dev
