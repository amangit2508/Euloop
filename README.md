# 📝 Complaint Management System

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react) 
![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-blue?logo=tailwind-css) 
![LocalStorage](https://img.shields.io/badge/Storage-localStorage-yellow)

A responsive web application built with **Next.js**, **React**, and **Tailwind CSS** that allows users to register, login, submit complaints with media and location, and track their status.

---

## 🌟 Features

- **User Authentication**
  - Sign up and login using email and password.
  - User session persists across page reloads using `localStorage`.

- **Complaint Management**
  - Submit new complaints with:
    - Title
    - Description
    - Category
    - Priority
    - Location
    - Media (Images/Videos)
  - Track all complaints in a dedicated **"My Complaints"** section.
  - Mark complaints as **Resolved** with a single click.
  - Dynamic counters on the home page for:
    - Total Complaints
    - Pending Complaints
    - Resolved Complaints

- **Responsive Design**
  - Fully responsive layout using Tailwind CSS.
  - Hover effects on form inputs, cards, and buttons for better UX.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 13, React 18, Tailwind CSS  
- **State Management:** React hooks (useState, useEffect)  
- **UI Components:** Reusable components (Card, Badge, Button, Input, Select, Textarea, Alert)  
- **Data Persistence:** `localStorage` for user accounts and complaints  
- **Media Support:** Upload images and videos as base64 URLs  

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/complaint-management.git
cd complaint-management
Install dependencies: 
npm install
2. Start the development server:

npm run dev


3. Open your browser:

http://localhost:3000

📁 Project Structure
.
├── app/                   # Next.js App directory
│   ├── page.tsx           # Home page with complaint stats
│   └── complaints.tsx     # User complaints page
├── components/            # Reusable UI components
│   ├── navbar.tsx
│   ├── complaint-form.tsx
│   └── ui/                # Tailwind-based UI components
├── contexts/
│   └── auth-context.tsx   # Authentication context and hooks
├── public/                # Static assets (images, icons)
├── styles/                # Tailwind CSS global styles
└── package.json

📌 Usage

Sign Up as a new user.

Login with your credentials.

Submit a Complaint:

Fill in the title, description, category, priority, location.

Upload images or videos if needed.

Track Complaints:

View all complaints in the "My Complaints" page.

Mark complaints as Resolved with the dedicated button.

The home page counters update automatically.

⚠️ Notes

This project uses localStorage for simplicity.
For production, a backend (Node.js, Express, MongoDB, or Firebase) should be used for:

Persistent storage

Secure authentication

Media handling

Media files are stored as base64 strings, which may increase localStorage size.

🔮 Future Improvements

Integrate a real backend with MongoDB or Firebase.

Add authentication with JWT tokens.

Improve media handling with cloud storage (AWS S3 / Cloudinary).

Add search, filter, and sort functionality for complaints.

Add admin panel to manage all complaints.