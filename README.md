# 🚀 LeadFlow - Lead Management System

A modern, full-stack lead management application built with Next.js, TypeScript, Express, and MongoDB. Streamline your sales process with comprehensive lead tracking, filtering, and analytics.

![LeadFlow Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=LeadFlow+Dashboard)

## ✨ Features

### 🎯 Core Functionality
- **Lead Management**: Create, view, update, and delete leads
- **Advanced Filtering**: Search by name/email, filter by status
- **Smart Sorting**: Sort by name, email, or creation date
- **Pagination**: Efficient data loading with customizable page sizes
- **Real-time Search**: Debounced search with instant feedback

### 📊 Analytics & Insights
- **Dashboard Overview**: Key metrics and conversion rates
- **Status Distribution**: Visual breakdown of lead pipeline
- **Recent Activity**: Latest lead updates and changes
- **Performance Tracking**: Monitor your sales funnel

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Sticky Navigation**: Always-accessible header and breadcrumbs
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Graceful error messages and retry options

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/fedhako7/lead-management.git
cd lead-management
```

### 2. Setup Frontend
```bash
# Move to lead-management/frontend
cd frontend
# Install dependencies
npm install

# Create environment file
cp .env

# Add your environment variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Setup Backend
```bash
# Move to lead-management/backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env

# Add your MongoDB connection string
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
# Move to lead-management/backend

cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# Move to lead-management/frontend

npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📁 Project Structure

```
lead-management/
├── app/                    # Next.js app directory
│   ├── leads/             # Lead management pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Site footer
│   └── breadcrumb.tsx    # Breadcrumb navigation
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
├── types/               # TypeScript type definitions
├── backend/            # Express.js backend
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Custom middleware
│   │   ├── types/      # Backend types
│   │   └── db/         # Database connection
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔧 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📊 API Endpoints

### Leads
- `POST /api/leads` - Create new lead
- `GET /api/leads` - Get all leads (with pagination, search, filter)

### Query Parameters
```
GET /api/leads?page=1&limit=10&search=john&status=New&sortBy=createdAt&sortOrder=desc
```

## 🎨 UI Components

### Pages
- **Dashboard** - Overview with stats and recent activity
- **Lead List** - Paginated table with filtering and search
- **Add Lead** - Form to create new leads

### Components
- **Header** - Sticky navigation with active states
- **Footer** - Links and social media
- **Breadcrumbs** - Navigation trail
- **Search Bar** - Debounced search input
- **Status Badges** - Color-coded lead status
- **Pagination** - Navigate through lead pages

## 🚀 Deployment

### 🔹 Frontend (Vercel)  
🌐 [Lead Management Frontend](https://lead-management-frontend-fedesas-projects.vercel.app/)

### 🔹 Backend (Render)  
🌐 [Lead Management Backend](https://lead-management-backend-at71.onrender.com/)


### Database (MongoDB Atlas)
1. Create cluster
2. Setup database user
3. Configure network access
4. Get connection string

## 👨‍💻 Author

**Fedesa Yelmachew**
- GitHub: [@fedhako7](https://github.com/fedhako7)
- LinkedIn: [linkfedhako7](https://linkedin.com/in/linkfedhako7)
- Twitter: [@nuyi_fi_siyi](https://twitter.com/nuyi_fi_siyi)
- LeetCode: [fedhasayel](https://leetcode.com/u/fedhasayel/)
