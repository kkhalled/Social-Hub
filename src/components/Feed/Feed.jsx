import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faUserGroup,
  faRss,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import PostDetails from "../posts/PostDetails";
import FeedSkeleton from "./FeedSkeleton";
import { PostsContext } from "../../context/PostProvider";
import { AuthContext } from "../../context/AuthContext";

export default function Feed() {
  const { posts, feedType, setFeedType, loadMore, hasMore, loadingMore } =
    useContext(PostsContext);
  const { user } = useContext(AuthContext);

  const TABS = [
    { key: "all", label: "For You", icon: faRss },
    { key: "following", label: "Following", icon: faUserGroup },
  ];

  return (
    <>
      {posts ? (
        <section className="mt-5 mb-10">
          {/* Feed Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
            <div className="flex">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFeedType(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                    feedType === tab.key
                      ? "text-blue-600 border-blue-600 bg-blue-50/50"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="text-xs" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon
                    icon={faNewspaper}
                    className="text-2xl text-blue-400"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {feedType === "following"
                    ? "No posts from people you follow"
                    : "No posts yet"}
                </h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                  {feedType === "following"
                    ? "Follow people from the community to see their posts here."
                    : "Be the first to share something!"}
                </p>
              </div>
            ) : (
              posts.map((post) => {
                const meId = user?._id || user?.id;
                const isLiked = Array.isArray(post.likes)
                  ? post.likes.some(
                      (l) => (typeof l === "string" ? l : l._id) === meId,
                    )
                  : false;

                return (
                  <PostDetails
                    key={post._id}
                    id={post._id}
                    body={post.body}
                    image={post.image}
                    name={post.user.name}
                    username={post.user.username}
                    photo={post.user.photo}
                    date={post.createdAt}
                    userId={post.user._id}
                    likes={post.likes || []}
                    likesCount={post.likesCount ?? (post.likes?.length || 0)}
                    commentsCount={post.commentsCount ?? 0}
                    sharesCount={post.sharesCount ?? 0}
                    topComment={post.topComment || null}
                    isLiked={isLiked}
                    isBookmarked={post.bookmarked || false}
                    isShare={post.isShare || false}
                    sharedPost={post.sharedPost || null}
                    privacy={post.privacy || "public"}
                  />
                );
              })
            )}
          </div>

          {/* Load more */}
          {hasMore && posts.length > 0 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-semibold text-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className="text-xs"
                    />
                    Loading...
                  </>
                ) : (
                  "Load More Posts"
                )}
              </button>
            </div>
          )}
        </section>
      ) : (
        <FeedSkeleton />
      )}
    </>
  );
}
