import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getPost } from "../../api/postsApi";
import { useParams, useNavigate, useLocation } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import PostSkeleton from "../../components/PostSkeleton/PostSkeleton";
import PostDetails from "../../components/PostDetails/PostDetails";
import EditPost from "../../components/EditPost/EditPost";
import NavBar from "../../components/NavBar/NavBar";

export default function Post() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if edit mode is active from query parameter
  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get("edit") === "true";

  async function getSinglePost() {
    try {
      const response = await getPost(id);
      const post = response.post ?? response.data?.post ?? null;
      if (post) setPost(post);
    } catch (error) {
      console.error(error);
    }
  }

  // Handle new comment - add it optimistically and then refresh
  function handleCommentCreated(newComment) {
    if (newComment && post) {
      setPost(prevPost => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), newComment]
      }));
    }
    getSinglePost();
  }

  useEffect(() => {
    getSinglePost();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors group"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span>Back to Feed</span>
        </button>
        {!post ? (
          <PostSkeleton />
        ) : isEditMode ? (
          <EditPost post={post} userPhoto={post.user.photo} userName={post.user.name} />
        ) : (
          <PostDetails 
            body={post.body} 
            image={post.image} 
            name={post.user.name} 
            username={post.user.username}
            photo={post.user.photo} 
            date={post.createdAt} 
            id={post._id || post.id}
            userId={post.user._id || post.user.id}
            onCommentCreated={handleCommentCreated}
            likes={post.likes || []}
            likesCount={post.likesCount ?? (post.likes?.length || 0)}
            commentsCount={post.commentsCount ?? 0}
            sharesCount={post.sharesCount ?? 0}
            topComment={post.topComment || null}
            isShare={post.isShare || false}
            sharedPost={post.sharedPost || null}
            privacy={post.privacy || "public"}
            comments={post.comments || []}
            isLiked={post.likes?.some(like => (typeof like === 'string' ? like : like._id) === (user?._id || user?.id)) || false}
            isBookmarked={post.bookmarked || false}
          />
        )}
      </div>
    </div>
  );
}
