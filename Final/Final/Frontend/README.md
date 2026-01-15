# SkillShare – AI-Powered Peer Learning Platform

SkillShare is a modern peer-to-peer learning web app built with React + TailwindCSS + Vite that connects students and tutors worldwide. It uses a credit-based economy and AI assistance to make collaborative learning affordable, gamified, and productive.

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Setup Instructions
```bash
# Clone the repository
git clone https://github.com/yourusername/skillshare.git
cd skillshare

# Install dependencies
npm install

# Start the development server
npm run dev
```

Your app will be live at http://localhost:5173/

## Authentication Flow

### Sign Up

- Click "Start Learning Free" or "Sign In" on the home page
- A modal appears allowing you to create a new account with:
  - Full name
  - Email address
  - Password
- After successful signup, the user is redirected to the Dashboard

### Sign In

- Use your registered credentials to log in
- Once logged in, access all dashboard features, including:
  - Sessions
  - AI Assistant
  - Requests
  - Profile management

### Admin Login

A hardcoded admin account is available for testing:

- Username: admin
- Password: pass123

The admin can access the admin dashboard to monitor users, tutors, and sessions.

## Key Features

### Home
Beautiful landing page explaining the platform with interactive modal for login/signup and "Learn Together, Grow Together" hero message.

### Dashboard
Displays user stats such as credits, sessions, and skill progress. Lists upcoming sessions, AI tutor recommendations, and recent activity.

### Find Partners
Browse expert tutors and learning partners. Filter by subject, rate, and availability. View tutor bios, ratings, and experience.

### Messages
Real-time chat simulation with multiple users. Send and receive messages during a session (demo mode).

### Resources
Curated study articles and blogs with "Read More" buttons opening in new tabs.

### AI Assistant
GPT-powered AI chat assistant for personalized learning help. Provides stats like credits used, accuracy, and session activity. Offers "Pro Tips" to improve your learning efficiency.

### Sessions
Lists all upcoming learning sessions. Each session includes date, tutor, duration, credits, and "Join Session" button (opens Google Meet link).

### Post Requests
Create learning requests with subjects, levels, and credits. Browse all community requests and accept ones you can help with.

### Profile
Edit name, email, and bio. View stats like credits left, credits used, and sessions completed. Change password securely.

### Payments
Manage subscriptions and saved cards. Cancel subscriptions or add new payment cards. Demo alert system for safe UX feedback.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TailwindCSS |
| Routing | React Router DOM |
| Icons | Lucide-React |
| State | React Hooks |
| UI/UX | Fully responsive with modern glassmorphism and gradient effects |


## Project Structure
```
src/
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── FindPartners.jsx
│   ├── AIAssistant.jsx
│   ├── Messages.jsx
│   ├── Sessions.jsx
│   ├── Profile.jsx
│   ├── Requests.jsx
│   ├── PostRequest.jsx
│   ├── Payment.jsx
│   ├── Browse.jsx
│   └── TutorProfile.jsx
├── components/
│   ├── AuthModal.jsx
│   ├── ProtectedRoute.jsx
│   ├── SearchBar.jsx
│   └── TutorCard.jsx
└── app/
    └── router.jsx
```

## Future Enhancements

- Backend integration (Express + MySQL)
- Persistent authentication via JWT
- Real calendar scheduling
- Peer review and rating system
- WebSocket-based real-time chat

## Credits

Built with love using React, TailwindCSS, and Vite


