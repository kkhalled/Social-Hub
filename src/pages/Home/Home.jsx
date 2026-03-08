import React, { useEffect, useContext } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Feed from "../../components/Feed/Feed";
import CreatePost from "../../components/CreatePost/CreatePost";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { PostsProvider } from "../../context/PostProvider";

export default function Home() {
  const { token, setUser } = useContext(AuthContext);

  async function getUserInfo() {
    try {
      const { data } = await axiosInstance.get("/users/profile-data");
      if (data.success === true || data.message === "success") {
        const userData = data.data?.user || data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block shrink-0">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <PostsProvider>
              <CreatePost />
              <Feed />
            </PostsProvider>
          </main>

          {/* Right Sidebar */}
          <div className="hidden xl:block shrink-0">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
