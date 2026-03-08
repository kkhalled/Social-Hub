import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../components/NavBar/NavBar";
import UserProfileHeader from "../../components/userProfile/UserProfileHeader";
import UserStatsBar from "../../components/userProfile/UserStatsBar";
import UserAboutSection from "../../components/userProfile/UserAboutSection";
import UserFollowingList from "../../components/userProfile/UserFollowingList";
import UserPostsList from "../../components/userProfile/UserPostsList";
import useUserProfileData from "../../hooks/useUserProfileData";
import useFollowToggle from "../../hooks/useFollowToggle";
import { AuthContext } from "../../context/AuthContext";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);

  // Custom hooks
  const {
    userProfile,
    userPosts,
    loading,
    loadingPosts,
    isFollowing,
    setIsFollowing,
    updateFollowerCount,
  } = useUserProfileData(userId);

  const { handleFollowToggle, followLoading } = useFollowToggle(
    userId,
    isFollowing,
    setIsFollowing,
    updateFollowerCount
  );

  const isOwnProfile =
    currentUser && (userId === currentUser._id || userId === currentUser.id);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="animate-pulse">
            <div className="h-52 bg-gray-200 rounded-xl mb-0" />
            <div className="bg-white rounded-b-xl px-8 pb-6 border border-gray-200 border-t-0">
              <div className="flex items-end gap-4 -mt-12 mb-4">
                <div className="w-28 h-28 rounded-full bg-gray-300 border-4 border-white shrink-0" />
                <div className="flex-1 pb-2 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-36" />
                  <div className="h-3.5 bg-gray-200 rounded w-24" />
                </div>
              </div>
              <div className="flex gap-6 mt-2">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg flex-1" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User not found
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 pt-24 text-center">
          <p className="text-3xl mb-2">👤</p>
          <h2 className="text-xl font-bold text-gray-800 mb-1">User not found</h2>
          <p className="text-gray-500 text-sm mb-6">
            This profile doesn't exist or was removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const p = userProfile;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 pt-4 pb-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium mb-3 bg-white px-4 py-2 rounded-xl border border-gray-200 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Back
        </button>

        {/* Profile Header */}
        <UserProfileHeader
          userProfile={userProfile}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onFollowToggle={handleFollowToggle}
        />

        {/* Stats Bar */}
        <UserStatsBar
          postsCount={userPosts.length}
          followersCount={p.followersCount}
          followingCount={p.followingCount}
        />

        {/* Content Grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Sidebar */}
          <div className="space-y-4">
            <UserAboutSection userProfile={userProfile} />
            <UserFollowingList
              following={p.following}
              followingCount={p.followingCount}
            />
          </div>

          {/* Right - Posts */}
          <UserPostsList
            userPosts={userPosts}
            loadingPosts={loadingPosts}
            isOwnProfile={isOwnProfile}
            userName={p.name}
            userProfile={userProfile}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}