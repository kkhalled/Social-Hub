import React, {  useContext } from "react";
import PostDetails from "../PostDetails/PostDetails";

import FeedSkeleton from "../FeedLoading/FeedSkeleton";
import { PostsContext } from "../../context/PostProvider";
import { AuthContext } from "../../context/AuthContext";


export default function Feed() {

  const { posts, feedType, setFeedType } = useContext(PostsContext);
  const { token, user } = useContext(AuthContext);

  // const [  ] = useState(false);
  function handleCommentCreated(newComment) {
    if (newComment && post) {
      // Optimistically add the comment immediately
      setPost(prevPost => ({
        prevPost,
        comments: [(prevPost.comments || []), newComment]
      }));
    }
  
  }
  

  return (
    <>
      {/* Section Header with gradient accent and feed toggle */}

      {posts ? (
        <section className="feed max-w-3xl mx-auto space-y-3 mt-8 px-4 sm:px-6 lg:px-0 mb-12">
          {" "}
          <header className="mb-8 relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl blur-xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-linear-to-r from-gray-600 via-gray-500 to-gray-400 bg-clip-text text-transparent tracking-tight">
                  Latest Posts
                </h2>
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Stay updated with what people are sharing
                </p>
              </div>
              
              {/* Feed Type Toggle */}
              <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <button
                  onClick={() => setFeedType("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    feedType === "all"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All Posts
                </button>
                <button
                  onClick={() => setFeedType("following")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    feedType === "following"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Following
                </button>
              </div>
            </div>
          </header>
          <div className="space-y-6">
            {posts.map((post) => {
              return (
                <PostDetails
                  key={post._id}
                  body={post.body}
                  image={post.image}
                  name={post.user.name}
                  photo={post.user.photo}
                  date={post.createdAt}
                  comments={post.comments}
                  onCommentCreated={handleCommentCreated}
                  commentsLimit={4}
                  id={post._id}
                  userId={post.user._id || post.user.id}
                  likes={post.likes || []}
                  isLiked={post.likes?.some(like => like._id === user?._id || like === user?._id) || false}
                  isBookmarked={post.isBookmarked || false}
                />
              );
            })}
          </div>
        </section>
      ) : (
        <FeedSkeleton />
      )}
    </>
  );
}
