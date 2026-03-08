import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faBookmark } from "@fortawesome/free-solid-svg-icons";
import PostDetails from "../posts/PostDetails";
import PostSkeleton from "../posts/PostSkeleton";

/**
 * PostsGrid Component
 * Displays posts or saved posts with loading states
 */
export default function PostsGrid({
  activeTab,
  userPosts,
  savedPosts,
  loadingPosts,
  loadingSaved,
  user,
  profile,
}) {
  if (activeTab === "posts") {
    if (loadingPosts) {
      return (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      );
    }

    if (userPosts.length === 0) {
      return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faClipboardList} className="text-2xl text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No posts yet</h3>
          <p className="text-sm text-gray-400">Share something with the world!</p>
        </div>
      );
    }

    return userPosts.map((post) => (
      <PostDetails
        key={post._id}
        body={post.body}
        image={post.image}
        name={profile.name}
        username={profile.username}
        photo={profile.photo}
        date={post.createdAt}
        id={post._id}
        userId={profile._id || profile.id}
        likes={post.likes || []}
        likesCount={post.likesCount ?? (post.likes?.length || 0)}
        commentsCount={post.commentsCount ?? 0}
        sharesCount={post.sharesCount ?? 0}
        topComment={post.topComment || null}
        isShare={post.isShare || false}
        sharedPost={post.sharedPost || null}
        privacy={post.privacy || "public"}
        isLiked={
          post.likes?.some(
            (like) =>
              (typeof like === "string" ? like : like._id) === (user?._id || user?.id)
          ) || false
        }
        isBookmarked={post.bookmarked || false}
      />
    ));
  }

  // Saved posts tab
  if (loadingSaved) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
      </>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faBookmark} className="text-2xl text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">No saved posts</h3>
        <p className="text-sm text-gray-400">Posts you bookmark will appear here</p>
      </div>
    );
  }

  return savedPosts.map((post) => (
    <PostDetails
      key={post._id}
      body={post.body}
      image={post.image}
      name={post.user?.name}
      username={post.user?.username}
      photo={post.user?.photo}
      date={post.createdAt}
      id={post._id}
      userId={post.user?._id || post.user?.id}
      likes={post.likes || []}
      likesCount={post.likesCount ?? (post.likes?.length || 0)}
      commentsCount={post.commentsCount ?? 0}
      sharesCount={post.sharesCount ?? 0}
      topComment={post.topComment || null}
      isShare={post.isShare || false}
      sharedPost={post.sharedPost || null}
      privacy={post.privacy || "public"}
      isLiked={
        post.likes?.some(
          (like) =>
            (typeof like === "string" ? like : like._id) === (user?._id || user?.id)
        ) || false
      }
      isBookmarked={true}
    />
  ));
}
