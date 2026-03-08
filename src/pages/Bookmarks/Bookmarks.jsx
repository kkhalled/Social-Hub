  import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBookmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../components/NavBar/NavBar";
import PostDetails from "../../components/posts/PostDetails";
import { getUserBookmarks } from "../../api/usersApi";
import PostSkeleton from "../../components/posts/PostSkeleton";
import { AuthContext } from "../../context/AuthContext";

export default function Bookmarks() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadBookmarks(1);
  }, []);

  async function loadBookmarks(pageNum = 1, append = false) {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const response = await getUserBookmarks(pageNum, 10);
      if (response.message === "success" || response.success === true) {
        const posts = response.data?.bookmarks || response.bookmarks || [];
        const paginationInfo = response.data?.paginationInfo || response.paginationInfo;

        if (append) {
          setBookmarkedPosts(prev => [...prev, ...posts]);
        } else {
          setBookmarkedPosts(posts);
        }

        if (paginationInfo) {
          setHasMore(paginationInfo.currentPage < paginationInfo.numberOfPages);
        } else {
          setHasMore(posts.length >= 10);
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all shadow-sm mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          </button>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200/50">
              <FontAwesomeIcon icon={faBookmark} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Saved Posts</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {loading ? "Loading..." : `${bookmarkedPosts.length} bookmarked post${bookmarkedPosts.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-5">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : bookmarkedPosts.length > 0 ? (
          <div className="space-y-5">
            {bookmarkedPosts.map((post) => (
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
                isLiked={post.likes?.some(like => (typeof like === "string" ? like : like._id) === (user?._id || user?.id)) || false}
                isBookmarked={true}
              />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-2 pb-4">
                <button
                  onClick={() => loadBookmarks(page + 1, true)}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-2xl border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm hover:shadow disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Loading...
                    </span>
                  ) : "Load More"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FontAwesomeIcon
                icon={faBookmark}
                className="text-3xl text-amber-300"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No saved posts yet
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
              When you bookmark a post, it will appear here for easy access later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
