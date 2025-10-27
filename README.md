# AI-Powered Learning Community

A modern web application connecting students and tutors in an AI-powered learning community. Students can post learning requests, and tutors can browse and respond to these requests.

## Features

### For Students
- Create learning requests with subject, skill level, and detailed descriptions
- Edit and delete your own posts
- Browse all learning requests from other students
- Find tutors based on subject expertise

### For Tutors
- Browse all student learning requests
- Filter posts by subject
- View detailed information about student needs
- Connect with students seeking help

### General Features
- Secure authentication with JWT tokens
- Role-based access control (Student/Tutor)
- Responsive design that works on all devices
- Beautiful, modern UI with professional styling
- Real-time data persistence with MongoDB

## Tech Stack

### Frontend
- **Vite + React** - Fast, modern development experience
- **TypeScript** - Type-safe development
- **Wouter** - Lightweight routing
- **TanStack Query** - Powerful data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality, accessible components
- **Lucide React** - Beautiful icons

### Backend
- **Node.js + Express** - Fast, minimalist web framework
- **MongoDB + Mongoose** - Flexible, document-based database
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js 20 or higher
- MongoDB database (local or MongoDB Atlas)

### Environment Variables

The following environment variables are required:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
```

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed the database with sample data:**
   ```bash
   npx tsx server/seed.ts
   ```
   
   This creates:
   - Student user: `alice@example.com` / `password123`
   - Tutor user: `bob@example.com` / `password123`
   - Two sample learning posts

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The application will run on:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
learning-community/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PostCard.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Profile.tsx
│   │   ├── context/         # React context providers
│   │   │   └── AuthContext.tsx
│   │   ├── lib/            # Utility functions
│   │   │   └── queryClient.ts
│   │   └── App.tsx         # Main app component
│   └── index.html
│
├── server/                  # Backend application
│   ├── db/
│   │   └── connection.ts   # MongoDB connection
│   ├── models/
│   │   ├── User.ts         # User model
│   │   └── Post.ts         # Post model
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── postController.ts
│   ├── middleware/
│   │   └── auth.ts         # JWT authentication middleware
│   ├── routes.ts           # API routes
│   ├── index.ts            # Server entry point
│   └── seed.ts             # Database seeding script
│
├── shared/                 # Shared between client and server
│   └── schema.ts          # TypeScript types and schemas
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user

### Posts (Protected)
- `GET /api/posts` - Get all learning posts
- `POST /api/posts` - Create a new post (students only)
- `PUT /api/posts/:id` - Update a post (owner only)
- `DELETE /api/posts/:id` - Delete a post (owner only)

## User Roles

### Student
- Can create, edit, and delete their own learning requests
- Can view all posts from other students
- Cannot create posts as a tutor

### Tutor
- Can browse all student learning requests
- Can filter posts by subject
- Cannot create learning requests

## Design Philosophy

The application follows a professional, trust-building design inspired by education platforms like LinkedIn Learning and Udemy:

- **Clarity First**: Clear role differentiation and intuitive navigation
- **Trust & Credibility**: Professional appearance that builds confidence
- **Scannable Content**: Easy-to-browse learning requests
- **Purposeful Hierarchy**: Guide users to key actions

## Future Enhancements

- AI-powered tutor-student matching based on subject expertise
- Real-time messaging between students and tutors
- Application/booking system for tutoring sessions
- User ratings and reviews
- Advanced search with categories and filters
- Availability scheduling
- Video call integration

## Demo Accounts

After seeding, you can login with:

**Student Account:**
- Email: `alice@example.com`
- Password: `password123`

**Tutor Account:**
- Email: `bob@example.com`
- Password: `password123`

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
