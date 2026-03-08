<div align="center">
  <h1>🌐 Social Connect</h1>
  <p><strong>A Modern Full-Stack Social Media Application</strong></p>
  <p>Built with React 19, Vite, and Tailwind CSS</p>
  
  ![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Concepts](#-key-concepts)
- [Performance Optimizations](#-performance-optimizations)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Social Connect** is a feature-rich social media platform that enables users to share posts, interact with content, connect with others, and build a community. This project demonstrates modern React development practices, including custom hooks, component composition, and efficient state management.

### 🌟 Highlights

- **Clean Architecture**: Modular component design with separation of concerns
- **Custom Hooks**: Reusable logic extracted into custom hooks for better code organization
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Optimistic UI updates for smooth user experience
- **Performance Focused**: Code splitting and lazy loading for optimal bundle sizes

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email verification
- Secure login with JWT authentication
- Protected routes and role-based access
- Password strength validation
- Persistent sessions with auto-refresh

### 📝 Post Management
- Create posts with text and images
- Edit and delete your own posts
- Rich text formatting support
- Image preview before upload
- Draft posts (auto-save)

### 💬 Social Interactions
- Like, comment, and share posts
- Nested comment replies
- Real-time comment updates
- Bookmark favorite posts
- Share posts with custom captions

### 👤 User Profiles
- Customizable profile with photo and cover image
- Bio and personal information
- View posts, bookmarks, and activity
- Follow/unfollow users
- Followers and following lists
- User statistics (posts, followers, following)

### 🔔 Notifications System
- Real-time notifications for:
  - New likes on your posts
  - Comments and replies
  - New followers
  - Shared posts
- Mark as read/unread functionality
- Filter by read status
- Notification badges

### 🌍 Community Features
- Discover new users
- Follow suggestions
- User search functionality
- Trending posts
- Community feed

### 🎨 UI/UX Features
- Modern, clean design
- Smooth animations and transitions
- Loading skeletons for better perceived performance
- Toast notifications for user feedback
- Responsive layout for all screen sizes
- Dark mode support (coming soon)

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Latest React with concurrent features
- **React Router 7.11.0** - Client-side routing with data loading
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Axios 1.13.2** - Promise-based HTTP client

### Form & Validation
- **Formik 2.4.9** - Form state management
- **Yup 1.7.1** - Schema validation

### UI Libraries
- **FontAwesome 7.1.0** - Icon library
- **React Toastify 11.0.5** - Toast notifications
- **Cairo Font** - Modern Arabic/Latin typography

### Development Tools
- **ESLint** - Code linting and formatting
- **Vite Plugin React** - Fast Refresh and JSX support

---

## 🏗️ Architecture

### Component Structure

The application follows a modular architecture with clear separation:

```
src/
├── api/                    # API client and endpoint definitions
│   ├── axiosInstance.js    # Configured axios instance
│   ├── postsApi.js         # Posts endpoints
│   ├── usersApi.js         # Users endpoints
│   ├── commentsApi.js      # Comments endpoints
│   └── notificationsApi.js # Notifications endpoints
│
├── components/             # Reusable UI components
│   ├── Auth/               # Authentication components
│   ├── posts/              # Post-related components
│   ├── profile/            # Profile page components
│   ├── userProfile/        # User profile components
│   ├── notifications/      # Notification components
│   ├── Ui/                 # Generic UI components
│   └── shared/             # Shared utilities
│
├── context/                # React Context providers
│   ├── AuthContext.jsx     # Authentication state
│   └── PostProvider.jsx    # Post management state
│
├── hooks/                  # Custom React hooks
│   ├── useProfileData.js   # Profile data fetching
│   ├── useNotifications.js # Notifications logic
│   ├── useFollowToggle.js  # Follow/unfollow logic
│   ├── usePostComments.js  # Comments management
│   └── useUserProfileData.js
│
├── pages/                  # Route pages
│   ├── Home/
│   ├── Profile/
│   ├── UserProfile/
│   ├── Notifications/
│   ├── Post/
│   ├── Community/
│   ├── Bookmarks/
│   ├── LogIn/
│   └── SignUp/
│
├── utils/                  # Utility functions
│   ├── formatters.js       # Date/time formatting
│   └── notificationHelpers.js
│
├── config/                 # Configuration files
│   └── api.js              # API base URL config
│
├── App.jsx                 # Main app component
└── main.jsx                # Application entry point
```

### Design Patterns

1. **Custom Hooks Pattern**: Business logic extracted into reusable hooks
2. **Component Composition**: Complex UIs built from smaller, focused components
3. **Container/Presentational**: Separation of logic and UI concerns
4. **Context for Global State**: Minimal prop drilling with Context API
5. **Controlled Components**: Form inputs managed by React state

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A backend API server (not included in this repo)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/social-app.git
cd social-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create a config file at src/config/api.js
export const API_BASE_URL = 'http://your-api-url.com/api';
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

### Key Directories

#### `/api` - API Integration
All API calls are centralized here using axios. Each module (posts, users, comments) has its own API file.

#### `/components` - UI Components
Organized by feature or shared usage:
- **Feature-specific**: `profile/`, `notifications/`, `posts/`
- **Shared/Reusable**: `Ui/`, `shared/`

#### `/hooks` - Custom React Hooks
Reusable stateful logic:
- `useProfileData` - Fetch and manage profile data
- `useNotifications` - Handle notification state and actions
- `useFollowToggle` - Follow/unfollow functionality
- `usePostComments` - Comments CRUD operations

#### `/context` - Global State
- **AuthContext**: User authentication state
- **PostProvider**: Post-related global state

#### `/pages` - Route Components
Each top-level route has its own directory with the main page component.

#### `/utils` - Utility Functions
Helper functions for formatting, validation, and common operations.

---

## 💡 Key Concepts

### Custom Hooks for Reusability

Instead of duplicating logic, we extract it into custom hooks:

```javascript
// Example: useProfileData hook
const { 
  profileData, 
  loading, 
  refetch 
} = useProfileData();
```

### Component Composition

Large components are broken down into smaller, focused sub-components:

```javascript
<Profile>
  <CoverSection />
  <ProfileCard />
  <AboutSection />
  <QuickStatsCards />
  <FollowersPreview />
  <ProfileTabs />
  <PostsGrid />
</Profile>
```

### Optimistic UI Updates

For better UX, UI updates happen immediately before API confirmation:

```javascript
// Update UI first
setLiked(!liked);
setLikesCount(liked ? likesCount - 1 : likesCount + 1);

// Then sync with server
await likePost(postId);
```

### Protected Routes

Authentication-based route protection:

```javascript
<Route element={<ProtectedRoute />}>
  <Route path="/profile" element={<Profile />} />
  <Route path="/notifications" element={<Notifications />} />
</Route>
```

---

## ⚡ Performance Optimizations

### Code Splitting

Pages are lazy-loaded for smaller initial bundle:

```javascript
const Profile = lazy(() => import('./pages/Profile/Profile'));
```

### Build Optimization

- **Vendor Chunks**: Third-party libraries separated
- **Tree Shaking**: Unused code eliminated
- **Minification**: Code compressed for production
- **Bundle Analysis**: Regular monitoring of bundle sizes

### Current Bundle Sizes (gzipped)

- **Main Bundle**: 59.03 kB
- **Profile Page**: 6.37 kB
- **Notifications**: 3.11 kB
- **User Profile**: 3.34 kB

### Image Optimization

- Lazy loading for images
- Default avatars for missing images
- Responsive image sizing

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use functional components with hooks
- Follow ESLint rules
- Write descriptive commit messages
- Keep components small and focused
- Document complex logic with comments

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- FontAwesome for beautiful icons
- The open-source community

---

## 📧 Contact

For questions or feedback, reach out at: khaled.devcontact@example.com

---

<div align="center">
  <p>Made with ❤️ and React</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
