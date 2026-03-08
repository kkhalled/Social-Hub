import { createBrowserRouter, RouterProvider } from "react-router";
import { Bounce, ToastContainer } from "react-toastify";
import Home from "./pages/Home/Home";
import LogIn from "./pages/LogIn/LogIn";
import SignUp from "./pages/SignUp/SignUp";
import Post from "./pages/Post/Post";
import NotFound from "./pages/NotFound/NotFound";
import Profile from "./pages/Profile/Profile";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import UserProfile from "./pages/UserProfile/UserProfile";
import Notifications from "./pages/Notifications/Notifications";
import Community from "./pages/Community/Community";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthRoute from "./components/AuthRoute/AuthRoute";

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
        <RouterProvider router={router} />
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
