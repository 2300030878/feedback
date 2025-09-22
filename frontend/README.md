# Academic Feedback System - Frontend

## Overview
This is the React frontend for the Academic Feedback Management System. It provides a modern, responsive interface for students and administrators to interact with the feedback system.

## Features

### 🔐 Authentication
- **Login/Register**: Secure authentication with JWT tokens
- **Role-based Access**: Different interfaces for Students and Admins
- **Protected Routes**: Automatic redirection based on user roles

### 👨‍🎓 Student Features
- **Dashboard**: Overview of available subjects, faculty, and submitted feedback
- **Feedback Submission**: Easy-to-use form for rating faculty and subjects
- **My Feedback**: View previously submitted feedback
- **Real-time Stats**: Track feedback submission progress

### 👨‍💼 Admin Features
- **Admin Dashboard**: Comprehensive overview of system statistics
- **Analytics**: Detailed reports on faculty performance and feedback trends
- **Subject Management**: Add, edit, and manage academic subjects
- **Faculty Management**: Manage faculty members and their assignments
- **Feedback Overview**: View all feedback submissions across the system

## Technology Stack
- **React 19.1.1** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Hook Form** - Form handling and validation
- **Yup** - Schema validation
- **Lucide React** - Beautiful icons
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8082`

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── student/        # Student-specific components
│   │   ├── StudentDashboard.jsx
│   │   └── FeedbackForm.jsx
│   ├── admin/          # Admin-specific components
│   │   └── AdminDashboard.jsx
│   ├── layout/         # Layout components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   └── error/          # Error pages
│       ├── Unauthorized.jsx
│       └── NotFound.jsx
├── contexts/           # React Context providers
│   ├── AuthContext.jsx
│   └── FeedbackContext.jsx
├── services/           # API services
│   └── api.js
├── App.jsx            # Main app component with routing
├── main.jsx          # Application entry point
└── index.css         # Global styles with Tailwind
```

## Key Features

### 🔒 Security
- JWT token-based authentication
- Automatic token refresh
- Role-based route protection
- Secure API communication

### 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS for consistent styling
- Accessible components
- Modern UI/UX patterns

### 🚀 Performance
- React 19 with latest features
- Optimized bundle size with Vite
- Lazy loading for better performance
- Efficient state management

### 🎨 User Experience
- Intuitive navigation
- Real-time feedback
- Loading states and error handling
- Consistent design system

## API Integration

The frontend communicates with the backend through a centralized API service:

```javascript
// Example API usage
import { authAPI, feedbackAPI } from './services/api';

// Login
const response = await authAPI.login({ email, password });

// Submit feedback
const feedback = await feedbackAPI.submit(feedbackData);
```

## State Management

The application uses React Context for state management:

- **AuthContext**: User authentication and authorization
- **FeedbackContext**: Feedback data and operations

## Routing

The application uses React Router for navigation:

- **Public Routes**: `/login`, `/register`
- **Student Routes**: `/student/dashboard`, `/student/feedback`
- **Admin Routes**: `/admin/dashboard`, `/admin/analytics`
- **Protected Routes**: All routes require authentication

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for code quality
- Consistent component structure
- Proper error handling
- Accessible markup

## Deployment

The frontend is designed to work with the backend API. For production deployment:

1. Build the application: `npm run build`
2. Serve the `dist` folder with a web server
3. Ensure the backend API is accessible
4. Configure CORS settings in the backend

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code structure
2. Use TypeScript for better type safety
3. Write tests for new components
4. Follow the established naming conventions
5. Ensure accessibility standards