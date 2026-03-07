import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBookmark } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../components/NavBar/NavBar";
import PostDetails from "../../components/PostDetails/PostDetails";
import { getUserBookmarks } from "../../api/usersApi";
import PostSkeleton from "../../components/PostSkeleton/PostSkeleton";

export default function Bookmarks() {
  const navigate = useNavigate();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  async function loadBookmarks() {
    try {
      setLoading(true);
      const response = await getUserBookmarks(page, 10);
      if (response.message === "success") {
        setBookmarkedPosts(response.bookmarks || []);
        setHasMore(response.hasMore || false);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-yellow-500 to-yellow-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faBookmark} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Posts</h1>
              <p className="text-gray-600 text-sm">
                {bookmarkedPosts.length} bookmarked posts
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : bookmarkedPosts.length > 0 ? (
          <div className="space-y-6">
            {bookmarkedPosts.map((post) => (
              <PostDetails
                key={post._id}
                body={post.body}
                image={post.image}
                name={post.user?.name}
                photo={post.user?.photo}
                date={post.createdAt}
                comments={post.comments || []}
                commentsLimit={4}
                id={post._id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FontAwesomeIcon
              icon={faBookmark}
              className="text-6xl text-gray-300 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved posts yet
            </h3>
            <p className="text-gray-600">
              Posts you bookmark will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
