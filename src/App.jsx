import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Bounce, ToastContainer } from "react-toastify";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthRoute from "./components/AuthRoute/AuthRoute";

// Lazy load all page components for code splitting
const Home = lazy(() => import("./pages/Home/Home"));
const LogIn = lazy(() => import("./pages/LogIn/LogIn"));
const SignUp = lazy(() => import("./pages/SignUp/SignUp"));
const Post = lazy(() => import("./pages/Post/Post"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Bookmarks = lazy(() => import("./pages/Bookmarks/Bookmarks"));
const UserProfile = lazy(() => import("./pages/UserProfile/UserProfile"));
const Notifications = lazy(() => import("./pages/Notifications/Notifications"));
const Community = lazy(() => import("./pages/Community/Community"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: <AuthRoute>
        <LogIn />
      </AuthRoute>,
    },
    {
      path: "/signup",
      element: <AuthRoute>
        <SignUp />
      </AuthRoute>,
    },
    {
      path: "/post/:id",
      element: (
        <ProtectedRoute>
          <Post  />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      )
    },
    {
      path: "/user/:userId",
      element: (
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      )
    },
    {
      path: "/bookmarks",
      element: (
        <ProtectedRoute>
          <Bookmarks />
        </ProtectedRoute>
      )
    },
    {
      path: "/notifications",
      element: (
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      )
    },
    {
      path: "/community",
      element: (
        <ProtectedRoute>
          <Community />
        </ProtectedRoute>
      )
    },
    {
      path: "/*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </AuthProvider>
    </>
  );
}

export default App;
