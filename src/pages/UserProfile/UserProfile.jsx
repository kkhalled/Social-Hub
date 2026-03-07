import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUserPlus, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../components/NavBar/NavBar";
import PostDetails from "../../components/PostDetails/PostDetails";
import { getUserProfile, toggleFollowUser } from "../../api/usersApi";
import { getUserPosts } from "../../api/postsApi";
import PostSkeleton from "../../components/PostSkeleton/PostSkeleton";
import defaultAvatar from "../../assets/user.png";
import { toast } from "react-toastify";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadUserPosts();
  }, [userId]);

  async function loadUserProfile() {
    try {
      setLoading(true);
      const response = await getUserProfile(userId);
      if (response.message === "success") {
        setUserProfile(response.user);
        setIsFollowing(response.user?.isFollowing || false);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function loadUserPosts() {
    try {
      const response = await getUserPosts(userId, 1, 20);
      if (response.message === "success") {
        setUserPosts(response.posts || []);
      }
    } catch (error) {
      console.error("Error loading user posts:", error);
    }
  }

  async function handleFollowToggle() {
    try {
      setFollowLoading(true);
      const response = await toggleFollowUser(userId);
      if (response.message === "success") {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? "Unfollowed" : "Following");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 pt-6 text-center">
          <p className="text-gray-600">User not found</p>
        </div>
      </div>
    );
  }

  const memberSince = new Date(userProfile.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <NavBar />
      
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-lg border overflow-hidden mb-6">
          {/* Cover */}
          <div className="h-40 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600" />

          <div className="px-8 pb-8 -mt-20">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end mb-8">
              {/* Profile Photo */}
              <div className="relative">
                <img
                  src={userProfile.photo || defaultAvatar}
                  alt={userProfile.name}
                  className="w-40 h-40 rounded-full object-cover ring-8 ring-white shadow-2xl"
                />
                <span className="absolute bottom-4 right-4 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></span>
              </div>

              {/* User Info & Actions */}
              <div className="flex-1 mt-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {userProfile.name}
                    </h1>
                    <p className="text-gray-600">@{userProfile.email?.split('@')[0]}</p>
                  </div>
                  
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                      isFollowing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <FontAwesomeIcon icon={isFollowing ? faUserCheck : faUserPlus} />
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 py-6 border-y border-gray-200">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userPosts.length}
                </p>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userProfile.followers || 0}
                </p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userProfile.following || 0}
                </p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>

            {/* Bio */}
            {userProfile.bio && (
              <div className="mt-6">
                <p className="text-gray-700">{userProfile.bio}</p>
              </div>
            )}

            {/* Member Since */}
            <div className="mt-4 text-sm text-gray-500">
              Joined {memberSince}
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostDetails
                key={post._id}
                body={post.body}
                image={post.image}
                name={userProfile.name}
                photo={userProfile.photo}
                date={post.createdAt}
                comments={post.comments || []}
                commentsLimit={4}
                id={post._id}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-600">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
