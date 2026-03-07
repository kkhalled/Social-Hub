import React, { useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Feed from "../../components/Feed/Feed";
import CreatePost from "../../components/CreatePost/CreatePost";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";

import { useDelete } from "../../hooks/useDelete";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { PostsProvider } from "../../context/PostProvider";

export default function Home() {
  const { token ,setUser } = useContext(AuthContext);
  

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
      toast.error(error.response?.data?.message || "Failed to load user info");
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);
 

  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block shrink-0">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <PostsProvider>
              <CreatePost />
              <Feed  />
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
