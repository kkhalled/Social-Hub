import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import PostDetails from "../posts/PostDetails";
import PostSkeleton from "../posts/PostSkeleton";

export default function UserPostsList({
  userPosts,
  loadingPosts,
  isOwnProfile,
  userName,
  userProfile,
  currentUser,
}) {
  const p = userProfile;

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <FontAwesomeIcon icon={faClipboardList} className="text-blue-500 text-sm" />
        <h3 className="font-semibold text-gray-900">
          {isOwnProfile ? "My Posts" : `${userName}'s Posts`}
        </h3>
        {!loadingPosts && (
          <span className="ml-auto text-xs text-gray-400">
            {userPosts.length} post{userPosts.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Posts List */}
      {loadingPosts ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : userPosts.length > 0 ? (
        userPosts.map((post) => (
          <PostDetails
            key={post._id}
            body={post.body}
            image={post.image}
            name={p.name}
            username={p.username}
            photo={p.photo}
            date={post.createdAt}
            id={post._id}
            userId={p._id}
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
                  (typeof like === "string" ? like : like._id) ===
                  (currentUser?._id || currentUser?.id)
              ) || false
            }
            isBookmarked={post.bookmarked || false}
          />
        ))
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-14 text-center shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500 font-medium">No posts yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {isOwnProfile
              ? "Share something with your network!"
              : "This user hasn't posted anything yet."}
          </p>
        </div>
      )}
    </div>
  );
}
